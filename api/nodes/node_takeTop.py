def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Take Top"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    return rdd.zipWithIndex().\
        filter(lambda x: x[1] < params['n']).map(lambda x: x[0])
