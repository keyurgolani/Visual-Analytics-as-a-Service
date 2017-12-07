#! /usr/bin/env python
from bottle import route, run, request, response, static_file, hook
import entities
import importlib
import os
import json

import findspark
findspark.init()

import pyspark
sc = pyspark.SparkContext(appName="VAaaS")


utils = importlib.import_module("utils")
dao = importlib.import_module("dao")


@hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = \
        'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = \
        'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


@route('/process', method=['POST', 'OPTIONS'])
def process():
    """
    Processes the dataset denoted by the dataset ID using the Node Chain
    denoted by the JSON object in body of the request. Saves the result
    according to the parameters in the body of the request.
    :param dataset_id: id of the dataset to be processed according to the
    database
    :return: JSON with response status and response message
    """
    if request.method == 'OPTIONS':
        return {}
    request_values = json.loads(request.body.read())
    # node_chain = [
    #     {
    #         "node": "map",
    #         "logic": TODO: Map Code to be passed here
    #     },
    #     {
    #         "node": "reduce",
    #         "logic": TODO: Reduce Code to be passed here
    #     },
    #     {
    #         "node": "filter",
    #         "logic": TODO: Filter Code to be passed here
    #     },
    #     {
    #         "node": "extractUsingRegex",
    #         "params": {
    #             "regex": TODO: Extraction Regex to be passed here,
    #             "column": TODO: Column index to be passed here
    #         }
    #     },
    #     {
    #         "node": "splitUsingRegex",
    #         "params": {
    #             "regex": TODO: Split Regex to be passed here,
    #             "column": TODO: Column index to be passed here
    #         }
    #     },
    #     {
    #         "node": "splitUsingDelimiter",
    #         "params": {
    #             "delimeter": TODO: Split Delimiter to be passed here,
    #             "column": TODO: Column index to be passed here
    #         }
    #     },
    #     {
    #         "node": "duplicate",
    #         "params": {
    #             "interleave": TODO: Weather to interleave the
    #             duplicate fields or not.
    #             "start": TODO: Split Delimiter to be passed here,
    #             "end": TODO: Column index to be passed here
    #         }
    #     },
    #     {
    #         "node": "mergeWithDelimiter",
    #         "params": {
    #             "delimiter": TODO: Merge Delimiter to be passed here,
    #             "start": TODO: Start Column index to be passed here,
    #             "end": TODO: End Column index to be passed here
    #         }
    #     },
    #     {
    #         "node": "filterWithParameter",
    #         "params": {
    #             "parameter": TODO: ,
    #             "column": TODO: feature column index to be passed here,
    #             "value": TODO: Value to be filtered at to be passed here,
    #             "target_column: TODO: Index of the column that will act as
    #             target for the comparison"
    #         }
    #     },
    #     {
    #         "node": "filterUsingRegex",
    #         "params": {
    #             "regex": TODO: Fliter Regex to be passed here,
    #             "column": TODO: Column index to be passed here
    #         }
    #     },
    #     {
    #         "node": "slice",
    #         "params": {
    #             "start": TODO: Start index of the slice
    #             "end": TODO: End index of the slice
    #             "column": TODO: Column index to be passed here
    #         }
    #     },
    #     {
    #         "node": "convertTypeTo",
    #         "params": {
    #             "toType": TODO: Type to be converted to to be passed here,
    #             "columns": TODO: List of column indices to be passed here
    #         }
    #     }
    #     {
    #         "node": "addColumn",
    #         "params": {
    #             "at": TODO: Index to add new column at
    #             "value": TODO: Default value of the newly added column
    #         }
    #     }
    #     {
    #         "node": "chooseColumn",
    #         "params": {
    #             "indexes": TODO: Indexes to be performed operation on
    #             "operation": TODO: Add the keep / remove for the columns
    #             mentioned in the indexes
    #         }
    #     }
    #     {
    #         "node": "flatten",
    #         "params": {
    #             "start": TODO: start index to start flattening at
    #             "end": TODO: end index to do flattening till
    #         }
    #     }
    #     {
    #         "node": "reduceBy",
    #         "params": {
    #             "column": TODO: Column to reduce the rows by
    #             "aggregation": TODO: aggregation to be applied to columns
    #             other than reduce by column. (Can be list, add, xor,
    #             multiply)
    #         }
    #     }
    #     {
    #         "node": "sortBy",
    #         "params": {
    #             "column": TODO: Column index to act as key for sorting,
    #             "ascending": TODO: Weather to sort in ascending order or not
    #         }
    #     }
    #     {
    #         "node": "distinct"
    #     }
    #     {
    #         "node": "takeTop",
    #         "params": {
    #             "n": TODO: Number of top entries to be taken
    #         }
    #     }
    #     TODO: Finish Below Nodes
    #     {
    #         "node": "parseUserAgent",
    #         "params": {
    #             "column": TODO: Column to parse user agent from
    #             "replace": TODO: Weather the parsed value of user agent will
    #             replace the original data or not
    #         }
    #     }
    #     {
    #         "node": "parseDateTime",
    #         "params": {
    #             "column": TODO: Column to parse date time from
    #             "replace": TODO: Weather the parsed value of date time will
    #             replace the original data or not
    #         }
    #     }
    # ]
    # ==== Input ====
    dataset = dao.get_dataset(entities.Dataset(
        dataset_id=request_values['dataset_id'],
        owner=request_values['user_id']))
    rdd = utils.get_data(sc, dataset.get_full_path())

    # ==== Processing ====
    for node in request_values['node_chain']:
        code_module = importlib.import_module("nodes.node_" + node["node"])
        if (node["node"] == "map" or
                node["node"] == "reduce" or
                node["node"] == "filter"):
            rdd = code_module.run_node(rdd, utils, node["logic"])
        elif node["node"] == "custom":
            rdd = code_module.run_node(rdd, utils, node["logic"], sc)
        else:
            rdd = code_module.run_node(
                rdd, utils, node["params"] if "params" in node.keys() else {})

    # ==== Output ====
    name, ext = os.path.splitext(dataset.filename)
    processed_dataset = entities.Dataset(filename="{}_processed{}".format(
        name, ext), root_path=dataset.root_path,
        owner=request_values['user_id'],
        beautiful_name=dataset.beautiful_name + " Processed")
    job_id = dao.add_job_history(
        owner=request_values['user_id'],
        status="Processing",
        data=request_values['dataset_id'],
        node_chain=request_values['node_chain'],
        result_url="")
    if request_values['output']['isSorted']:
        if request_values['output']['limit']:
            utils.save_results(
                rdd.top(request_values['output']['limit']),
                processed_dataset.get_full_path(),
                request_values['output']['format'])
        else:
            utils.save_results(
                rdd.top(rdd.count()),
                processed_dataset.get_full_path(),
                request_values['output']['format'])
    else:
        utils.save_results(
            rdd.collect(), processed_dataset.get_full_path(),
            request_values['output']['format'])
    dataset_id = dao.add_dataset(processed_dataset).dataset_id
    dao.change_job_status(
        job_id=job_id,
        status="Completed",
        result_url="/download/" + str(dataset_id))
    return {
        "status": 200,
        "message": "Processed Successfully"
    }


@route('/upload', method='POST')
def do_upload():
    """
    Method to upload the dataset into the server and ultimately adding the
    entry to the database for uploaded dataset
    :return: Returns response code and response status
    """
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
    """
    Method downloads the dataset from dataset ID given
    :param dataset_id: dataset ID according to the database
    :return: file object for the requested dataset
    """
    dataset = dao.get_dataset(entities.Dataset(dataset_id=dataset_id, owner=1))
    return static_file(
        dataset.filename, root=dataset.root_path, download=dataset.filename)

# End ==================== Routes ======================

# ==================== Start Listening =================


run(host='0.0.0.0', port=8080, reloader=True)
