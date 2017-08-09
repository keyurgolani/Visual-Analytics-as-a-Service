#! /usr/bin/env python
import sys
from operator import add
from flask import *
import json

import findspark
findspark.init()

import pyspark
sc = pyspark.SparkContext(appName="myAppName")

app = Flask(__name__)


@app.route("/", methods=['POST', 'GET'])
def get_default():
    return "Default Route"


@app.route("/hello", methods=['POST', 'GET'])
def get_hello():
    return "Hello World"


@app.route("/count", methods=['POST', 'GET'])
def get_count():
    # print
    return json.dumps(sc.parallelize(request.data.split(". "))
                      .flatMap(lambda x: x.split(' '))
                      .map(lambda x: (x, 1))
                      .reduceByKey(add).collect())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
