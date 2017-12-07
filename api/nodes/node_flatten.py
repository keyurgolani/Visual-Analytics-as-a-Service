def run_node(rdd, utils, params):
    """
    Logic for Node "Flatten"
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
        Logic to duplicate a column or multiple columns and either
        append them at the end or interleave them within original
        columns and return the row
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: row with the given column/s duplicated and appended at right
        place
        :rtype: list
        """
        new_row = []
        for element in row:
            if type(element) == 'list':
                for sub_element in element:
                    new_row.append(sub_element)
            else:
                new_row.append(element)
        return new_row
    return rdd.map(run_logic)
