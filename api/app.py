#! /usr/bin/env python
from bottle import route, run, request, static_file
from entities import *

import findspark
findspark.init()

import pyspark
sc = pyspark.SparkContext(appName="myAppName")


utils = importlib.import_module("utils")
dao = importlib.import_module("dao")

@route('/process/<dataset_id>', method='POST')
def process(dataset_id):
    node_chain = ["map", "reduce"]
    # ==== Input ====
    dataset = dao.get_dataset(Dataset(dataset_id=dataset_id, owner=1))
    rdd = utils.get_data(sc, dataset.get_full_path())

    # ==== Processing ====
    for node in node_chain:
        code_module = importlib.import_module("node_" + node)
        if node == "map":
            rdd = code_module.run_node(rdd, utils, request.body.read())
        elif node == "custom":
            rdd = code_module.run_node(rdd, utils, request.body.read(), sc)
        else:
            rdd = code_module.run_node(rdd, utils)
    
    # ==== Output ====
    name, ext = os.path.splitext(dataset.filename)
    processed_dataset = Dataset(filename="{}_processed{}".format(name, ext), root_path=dataset.root_path, owner=1, beautiful_name=dataset.beautiful_name + " Processed")
    utils.save_results(rdd.collect(), processed_dataset.get_full_path(), "csv")
    dao.add_dataset(processed_dataset)

    return {
        "status": 200,
        "message": "Processed Successfully"
    }


@route('/upload', method='POST')
def do_upload():
    upload = request.files.get('upload')
    dataset = Dataset(filename=upload.filename, owner=1)
    with open(dataset.get_full_path(), 'w') as out:
        out.write(upload.file.read())
    dao.add_dataset(dataset)
    return {
        "status": 200,
        "message": "File uploaded successfully"
    }


@route('/download/<dataset_id>')
def do_download(dataset_id):
    dataset = dao.get_dataset(Dataset(dataset_id=dataset_id, owner=1))
    return static_file(dataset.filename, root=dataset.root_path, download=dataset.filename)

# End ==================== Routes ======================

# ==================== Start Listening =================

run(host='localhost', port=8080, reloader=True)