import os

default_data_path = "datasets"


def write_to_file(logic):
    i = 0
    while os.path.exists(
        os.path.join(
            "logics", "temp{}.py".format(i))) and os.path.isfile(
                os.path.join(
                    "logics", "temp{}.py".format(i))):
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
            outfile.write(("," if format.lower() == "csv" else "\t").join(values))
            outfile.write("\n")


def encode_value(element):
    if type(element) == str:
        return "'{}'".format(element)
    elif type(element) == unicode:
        return "'{}'".format(element.encode("ascii", "ignore"))
    else:
        return str(element)


def ispalindrome(s):
    length = len(s)
    for i in range(length / 2):
        if s[i] != s[length - i - 1]:
            return False
    return True


def isanagram(s1, s2):
    c1 = [0] * 26
    c2 = [0] * 26
    for i in range(len(s1)):
        pos = ord(s1[i]) - ord('a')
        c1[pos] = c1[pos] + 1
    for i in range(len(s2)):
        pos = ord(s2[i]) - ord('a')
        c2[pos] = c2[pos] + 1
    j = 0
    stillOK = True
    while j < 26 and stillOK:
        if c1[j] == c2[j]:
            j = j + 1
        else:
            stillOK = False
    return stillOK
