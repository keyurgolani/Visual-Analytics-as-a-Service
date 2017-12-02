def run_node(rdd, utils, params):
    """
    Logic for Node "Slice Column"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: Parameters passed from client for the Node
    :type params: dict
    :return: RDD with Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    def run_logic(row):
        """
        Logic to slice given column from given start index to given end index
        and return the whole row with the column replaced
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: row after performing the operation
        :rtype: list
        """
        row[params['column']] = row[
            params['column']][params['start']:params['end'] + 1]
        return row
    return rdd.map(run_logic)