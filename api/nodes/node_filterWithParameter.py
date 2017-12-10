def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Filter With Parameters"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with filter Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    def run_logic(row):
        """
        Logic to find weather the row fits the parameters passed in the params
        from client and return True or False
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: True or False based on given condition and row
        :rtype: boolean
        """
        data_value = row[params['column']]
        if 'value' in params.keys():
            target_value = int(params['value'])
        elif 'target_column' in params.keys():
            target_value = row[params['target_column']]
        if params['parameter'] == 'greater':
            return data_value > target_value
        elif params['parameter'] == 'less':
            return data_value < target_value
        elif params['parameter'] == 'equal':
            return data_value == target_value
        elif params['parameter'] == 'ge':
            return data_value >= target_value
        elif params['parameter'] == 'le':
            return data_value <= target_value
        elif params['parameter'] == 'ne':
            return data_value != target_value
        elif params['parameter'] == 'contains':
            return target_value in data_value
        elif params['parameter'] == 'in':
            return data_value in target_value
        elif params['parameter'] == 'longer':
            return len(data_value) > len(target_value)
        elif params['parameter'] == 'shorter':
            return len(data_value) > len(target_value)
        elif params['parameter'] == 'anagram':
            return utils.isanagram(data_value, target_value)
        elif params['parameter'] == 'palindrome':
            return utils.ispalindrome(data_value)
        elif params['parameter'] == 'isupper':
            return data_value.isupper()
        elif params['parameter'] == 'islower':
            return data_value.islower()
        elif params['parameter'] == 'isspace':
            return data_value.isspace()
        elif params['parameter'] == 'isalphabet':
            return data_value.isalpha()
        elif params['parameter'] == 'isalphanum':
            return data_value.isalnum()
        elif params['parameter'] == 'isnumeric':
            return data_value.isnumeric()
        elif params['parameter'] == 'isdecimal':
            return data_value.isdecimal()
        else:
            import errors
            raise errors.UnimplementedOperationError()
    return rdd.filter(run_logic)
