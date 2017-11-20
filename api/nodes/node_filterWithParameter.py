def run_node(rdd, utils, params):
    def run_logic(row):
        data_value = row[params['column']]
        if 'value' in params.keys():
            target_value = params['value']
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
