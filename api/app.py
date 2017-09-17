#! /usr/bin/env python
import sys
from operator import add
from bottle import route, run, request, static_file
# from processing import node_processing
import json
import os
import importlib
import uuid

import findspark
findspark.init()

import pyspark
sc = pyspark.SparkContext(appName="myAppName")
data_root = "/hdfs/data"


utils = importlib.import_module("utils")

# ============ Initialize Server ==============

utils.initialize_server()

# End ============ Initialize Server ==============

# ==================== Routes ======================

@route('/process/<filename>/<node>', method='POST')
def process(filename, node):
    import pdb; pdb.set_trace()
    code_module = importlib.import_module("node_" + node)
    # ==== Input ====
    dataset = utils.get_data(sc, os.path.join(data_root, utils.get_uuid(filename, "data_mapping")))

    # ==== Processing ====
    if node == "map":
        result = code_module.run_node(dataset, utils, request.body.read())
    elif node == "custom":
        result = code_module.run_node(dataset, utils, request.body.read(), sc)
    else:
        result = code_module.run_node(dataset, utils)
    
    # ==== Output ====
    name, ext = os.path.splitext(filename)
    utils.save_results(result, os.path.join(data_root, utils.map_uuid("{}_processed{}".format(name, ext), "data_mapping")), "csv")

    return {
        "status": 200,
        "message": "Processed Successfully"
    }

@route('/upload', method='POST')
def do_upload():
    upload = request.files.get('upload')
    save_path = os.path.join(data_root, utils.map_uuid(upload.filename, "data_mapping"))
    with open(save_path, 'w') as out:
        out.write(upload.file.read())
    return {
        "status": 200,
        "message": "File uploaded successfully",
        "file": upload.filename
    }

@route('/download/<filename>')
def do_download(filename):
    return static_file(utils.get_uuid(filename, "data_mapping"), root=data_root, download=filename)

# End ==================== Routes ======================

# ==================== Start Listening =================

run(host='localhost', port=8080, reloader=True)