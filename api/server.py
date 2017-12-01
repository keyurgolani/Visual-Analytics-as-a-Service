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

# TODO: Move complimenting methods from Utils to a seperate module.
# TODO: Pass complementing module in nodes rather than utils.


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
        #         "parameter": TODO: ,
        #         "column": TODO: feature column index to be passed here,
        #         "value": TODO: Value to be filtered at to be passed here,
        #         "target_column: TODO: Index of the column that will act as
        #         target for the comparison"
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
        #     "node": "slice",
        #     "params": {
        #         "start": TODO: Start index of the slice
        #         "end": TODO: End index of the slice
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
        # {
        #     "node": "addColumn",
        #     "params": {
        #         "at": TODO: Index to add new column at
        #         "value": TODO: Default value of the newly added column
        #     }
        # }
        # {
        #     "node": "chooseColumn",
        #     "params": {
        #         "indexes": TODO: Indexes to be performed operation on
        #         "operation": TODO: Add the keep / remove for the columns
        #         mentioned in the indexes
        #     }
        # }
        # {
        #     "node": "flatten",
        #     "params": {
        #         "start": TODO: start index to start flattening at
        #         "end": TODO: end index to do flattening till
        #     }
        # }
        # TODO: Finish Below Nodes
        # {
        #     "node": "parseUserAgent",
        #     "params": {
        #         "column": TODO: Column to parse user agent from
        #         "replace": TODO: Weather the parsed value of user agent will
        #         replace the original data or not
        #     }
        # }
        # TODO: Add reduce nodes
        # TODO: Add aggregation nodes
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
    # TODO: Finish Job History Addition Functionality
    dao.add_job_history()

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
