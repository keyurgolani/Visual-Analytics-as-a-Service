def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Find Median"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """

    def extract_column(col_index):
        return rdd\
            .map(lambda x: [int(x[col_index]) if x[col_index] else 0])\
            .map(lambda x: (-1, x))\
            .reduceByKey(lambda x, y: x + y)\
            .map(lambda x: x[1])\
            .collect()[0]

    import numpy as np
    column = extract_column(params['column'])
    col_median = np.median(np.array(column))
    median = rdd.filter(lambda row: int(row[params['column']]) == col_median).first()
    return (median, rdd)
