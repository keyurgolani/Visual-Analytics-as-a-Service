def run_node(rdd, utils, params):
    def run_logic(row):
        if utils['interleave']:
            for current_column in range(params['end'], params['start'] - 1, -1):
                row[current_column:current_column + 1] = [row[current_column],
                                                          row[current_column]]
        else:
            row[utils['start']:utils['end'] + 1] = row[
                utils['start']:utils['end'] + 1] + row[
                    utils['start']:utils['end'] + 1]
    return rdd.map(run_logic)
