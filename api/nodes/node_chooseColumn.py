def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Choose Column"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    def run_logic(row):
        """
        Logic to either eliminate or keep based on the operation
        mentioned in params from client side the columns mentioned in
        params from the client side and return the resulting row
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: row with the given column/s kept or eliminated based on
        operation mentioned in params
        :rtype: list
        """
        row = map(lambda y: y[1], filter(lambda x: (x[0] in params['indexes'])
                                         if (params['operation'] == 'keep')
                                         else (x[0] not in params['indexes']),
                                         enumerate(row)))
        return row
    return rdd.map(run_logic)
