def run_node(rdd, utils, params):
    def run_logic(row):
        if params['interleave']:
            for current_column in range(params['end'], params['start'] - 1, -1):
                row[current_column:current_column + 1] = [row[current_column],
                                                          row[current_column]]
        else:
            row[params['start']:params['end'] + 1] = row[
                params['start']:params['end'] + 1] + row[
                    params['start']:params['end'] + 1]
        return row
    return rdd.map(run_logic)
