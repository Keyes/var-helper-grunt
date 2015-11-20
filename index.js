var _ = require('lodash');

var VarHelperGrunt = function(grunt) {
    this.grunt = grunt;
    this.config = grunt.config();
    // this._ = _;
    this.dataArray = [];

    return this;
};

VarHelperGrunt.prototype = {
    get r() {
        return this.dataArray;
    },

    get not() {
        this.dataArray = _xfix('!', this.dataArray, '');

        return this;
    }
};

VarHelperGrunt.prototype.i = function(data) {
    this.dataArray = this.grunt.config(data);
    return this;
};

VarHelperGrunt.prototype.flatten = function(level) {
    this.dataArray = _flattenToLevel(this.dataArray, 0, level);

    return this;
};


VarHelperGrunt.prototype.prefix = function(prefix) {
    this.dataArray = _xfix(prefix, this.dataArray, '');

    return this;
};

VarHelperGrunt.prototype.suffix = function(suffix) {
    this.dataArray = _xfix('', this.dataArray, suffix);

    return this;
};

//////////////////////////////////////////////////////////////////////////////////
///// private methods ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var _xfix = function(prefix, array, suffix) {
    var self = this;

    if(array instanceof Array) {
        array = _.map(array, function(n) {

            if (n instanceof Array) {
                return _.map(n, function(c) {
                    return prefix + c + suffix;
                });
            } else {
                return prefix + n + suffix;
            }
        });
    } else {
        array = prefix + array + suffix;
    }

    return array;
};

function _flattenToLevel(variable, level, maxlevel) {
    for (var key in variable) {
        if (key === 'options') continue;

        if (level < maxlevel && _canBeTraversed(variable[key])) {
            variable[key] = _flattenToLevel(variable[key], level+1, maxlevel);
        } else if (_canBeFlatted(variable[key])) {
            variable[key] = _.flatten(variable[key], true);
        }
        else {
            variable[key] = variable[key];
        }
    }

    return variable;

}

function _canBeFlatted(something) {
    return typeof something !== 'string';
}

function _canBeTraversed(something) {
    if (something instanceof Array) {
        return false;
    }

    return (something instanceof Object);
}

//////////////////////////////////////////////////////////////////////////
///// exports ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

module.exports = function (grunt) {
    var helper = new VarHelperGrunt(grunt);
    return helper;
};

