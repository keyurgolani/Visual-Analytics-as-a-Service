def run_node(rdd, utils, params):
    """
    Logic for Node "Remove Header"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    header = rdd.first()
    return rdd.filter(lambda line: line != header)
