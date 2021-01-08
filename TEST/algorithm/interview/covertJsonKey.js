function convert(jsonObj) {
    // 请实现
    if (Array.isArray(jsonObj)) {
        jsonObj.forEach(function (item) {
            convert(item);
        });
    }
    else {
        var keys = Object.keys(jsonObj);
        keys.forEach(function (key) {
            var newKey = convertKey(key);
            jsonObj[newKey] = jsonObj[key];
            delete jsonObj[key];
            if (jsonObj[newKey] && typeof jsonObj[newKey] === 'object') {
                convert(jsonObj[newKey]);
            }
        });
    }
    return jsonObj;
}
function convertKey(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        if (str[i] === '_' && str[i + 1]) {
            result = result + str[++i].toUpperCase();
        }
        else {
            result = result + str[i];
        }
    }
    return result;
}
// ------ 测试 ---------
console.log(convert({ 'a_bc_def': 1 }));
console.log(convert({ 'a_bc_def': { 'foo_bar': 2 } }));
console.log(convert({ 'a_bc_def': [{ 'foo_bar': 2 }, { 'goo_xyz': 3 }] }));
