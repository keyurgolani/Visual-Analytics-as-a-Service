#! /usr/bin/env python
import sys
from operator import add
from bottle import route, run, request
import json

import findspark
findspark.init()

import pyspark
sc = pyspark.SparkContext(appName="myAppName")


@route('/count', method='POST')
def get_count():
    return json.dumps(sc.parallelize(request.data.split(". "))
                      .flatMap(lambda x: x.split(' '))
                      .map(lambda x: (x, 1))
                      .reduceByKey(add).collect())

@route('/')
def get_default():
    return "Default Route"

@route('/hello')
def get_hello():
    return "Hello World"

run(host='localhost', port=80)