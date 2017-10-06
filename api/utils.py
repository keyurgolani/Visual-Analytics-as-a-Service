import os
import uuid

default_data_path = "datasets"


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


def save_results(results, file, format):
    with open(file, 'w+') as outfile:
        for result in results:
            values = map(str, result)
            outfile.write(("," if format == "csv" else "\t").join(values))
            outfile.write("\n")


def encode_value(element):
    if type(element) == str:
        return "'{}'".format(element)
    elif type(element) == unicode:
        return "'{}'".format(element.encode("ascii", "ignore"))
    else:
        return str(element)
