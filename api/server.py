#! /usr/bin/env python
from bottle import route, run, request, static_file
import entities
import importlib
import os

import findspark
findspark.init()

import pyspark
sc = pyspark.SparkContext(appName="VAaaS")


utils = importlib.import_module("utils")
dao = importlib.import_module("dao")


@route('/process/<dataset_id>', method='POST')
def process(dataset_id):
    node_chain = [
        # {
        #     "node": "map",
        #     "logic": TODO: Map Code to be passed here
        # },
        # {
        #     "node": "reduce",
        #     "logic": TODO: Reduce Code to be passed here
        # },
        # {
        #     "node": "filter",
        #     "logic": TODO: Filter Code to be passed here
        # },
        # {
        #     "node": "extractUsingRegex",
        #     "params": {
        #         "regex": TODO: Extraction Regex to be passed here,
        #         "column": TODO: Column index to be passed here
        #     }
        # },
        # {
        #     "node": "splitUsingRegex",
        #     "params": {
        #         "regex": TODO: Split Regex to be passed here,
        #         "column": TODO: Column index to be passed here
        #     }
        # },
        # TODO: Below Nodes
        # {
        #     "node": "splitUsingDelimiter",
        #     "params": {
        #         "regex": TODO: Split Delimeter to be passed here,
        #         "column": TODO: Column index to be passed here
        #     }
        # },
        # {
        #     "node": "duplicate",
        #     "params": {
        #         "interleave": TODO: Weather to interleave the
        #         duplicate fields or not.
        #         "start": TODO: Split Delimeter to be passed here,
        #         "end": TODO: Column index to be passed here
        #     }
        # },
        # {
        #     "node": "mergeWithDelimeter",
        #     "params": {
        #         "delimeter": TODO: Merge Delimeter to be passed here,
        #         "start": TODO: Start Column index to be passed here,
        #         "end": TODO: End Column index to be passed here
        #     }
        # },
        # {
        #     "node": "filterWithParameter",
        #     "params": {
        #         "parameter": TODO: greater / less / equal / greater equal /
        #         less equal to be passed here,
        #         "column": TODO: feature column index to be passed here
        #         "value": TODO: Value to be filtered at to be passed here
        #     }
        # },
        # {
        #     "node": "filterUsingRegex",
        #     "params": {
        #         "regex": TODO: Fliter Regex to be passed here,
        #         "column": TODO: Column index to be passed here
        #     }
        # },
        # {
        #     "node": "convertTypeTo",
        #     "params": {
        #         "toType": TODO: Type to be converted to to be passed here,
        #         "columns": TODO: List of column indices to be passed here
        #     }
        # }
    ]
    # ==== Input ====
    dataset = dao.get_dataset(entities.Dataset(dataset_id=dataset_id, owner=1))
    rdd = utils.get_data(sc, dataset.get_full_path())

    # ==== Processing ====
    for node in node_chain:
        code_module = importlib.import_module("nodes.node_" + node["node"])
        if (node["node"] == "map" or
                node["node"] == "reduce" or
                node["node"] == "filter"):
            rdd = code_module.run_node(rdd, utils, node["logic"])
        elif node["node"] == "custom":
            rdd = code_module.run_node(rdd, utils, node["logic"], sc)
        else:
            rdd = code_module.run_node(rdd, utils, node["params"])

    # ==== Output ====
    name, ext = os.path.splitext(dataset.filename)
    processed_dataset = entities.Dataset(filename="{}_processed{}".format(
        name, ext), root_path=dataset.root_path,
        owner=1, beautiful_name=dataset.beautiful_name + " Processed")
    utils.save_results(rdd.collect(), processed_dataset.get_full_path(), "csv")
    dao.add_dataset(processed_dataset)

    return {
        "status": 200,
        "message": "Processed Successfully"
    }


@route('/upload', method='POST')
def do_upload():
    upload = request.files.get('upload')
    dataset = entities.Dataset(filename=upload.filename, owner=1)
    with open(dataset.get_full_path(), 'w+') as out:
        out.write(upload.file.read())
    dao.add_dataset(dataset)
    return {
        "status": 200,
        "message": "File uploaded successfully"
    }


@route('/download/<dataset_id>')
def do_download(dataset_id):
    dataset = dao.get_dataset(entities.Dataset(dataset_id=dataset_id, owner=1))
    return static_file(
        dataset.filename, root=dataset.root_path, download=dataset.filename)

# End ==================== Routes ======================

# ==================== Start Listening =================


run(host='0.0.0.0', port=8080, reloader=True)
