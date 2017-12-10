def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Add Column"
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
        Logic to add a new column to the row having the value in the params
        from the client side and return the row
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: row with an additional column with value given in params
        :rtype: list
        """
        if "parked" in params['value']:
            import re
            cols = map(int, re.findall('\d+', params['value']))
            new_values = []
            for col in cols:
                new_values.append(parked[col])
            new_values.append(row[params['at']])
            row[params['at']:params['at'] + 1] = new_values
        else:
            row[params['at']:params['at'] + 1] = [row[params['at']],
                                                  str(params['value'])]
        return row
    return rdd.map(run_logic)
