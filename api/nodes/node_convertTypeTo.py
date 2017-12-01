def run_node(rdd, utils, params):
    def run_logic(row):
        for column in params['columns']:
            if params['toType'] == 'integer':
                row[column] = int(row[column])
            elif params['toType'] == 'float':
                row[column] = float(row[column])
            elif params['toType'] == 'string':
                row[column] = str(row[column])
            elif params['toType'] == 'long':
                row[column] = long(row[column])
            elif params['toType'] == 'boolean':
                row[column] = bool(row[column])
            elif params['toType'] == 'set':
                row[column] = set(row[column])
            elif params['toType'] == 'list':
                row[column] = list(row[column])
            elif params['toType'] == 'tuple':
                row[column] = tuple(row[column])
            else:
                import errors
                raise errors.UnimplementedOperationError()
        return row
    return rdd.map(run_logic)
