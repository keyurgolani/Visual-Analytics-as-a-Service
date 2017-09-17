import os
import uuid

data_mapping = {}

def initialize_server():
    with open("data_mapping.info", 'r+') as data_mappings:
        for mapping in data_mappings:
            filename, uuid = mapping.split('\t')
            data_mapping[filename] = uuid


def write_to_file(logic):
    i = 0
    while os.path.exists(os.path.join("logics", "temp{}.py".format(i))) and os.path.isfile(os.path.join("logics", "temp{}.py".format(i))):
        i += 1
    else:
        with open(os.path.join("logics", "temp{}.py".format(i)), 'w+') as f:
            f.write(logic)
    return os.path.join("logics", "temp{}.py".format(i))


def get_data(sc, filename):
    return sc.parallelize(open(filename, "r+").read().split("\n"))

def get_uuid(filename, category):
    return eval(category)[filename]

def map_uuid(filename, category):
    eval(category)[filename] = str(uuid.uuid4())
    return eval(category)[filename]

def save_results(results, file, format):
    with open(file, 'w+') as outfile:
        for result in results:
            outfile.write(("," if format == "csv" else "\t").join(result))
            outfile.write("\n")