const format = (str, ...rest) => {
    let t = typeof rest[0];
    let args
    if (rest.length === 0)
        args = {}
    else
        args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(rest)
                : rest[0];

    let splits = []

    let s = str.toString()
    while(s.length > 0){
        var m = s.match(/{(?!{)([\w\d]+)}(?!})/)
        if (m !== null){
            let left = s.substr(0, m.index)
            //var sep = s.substr(m.index, m[0].length)
            s = s.substr(m.index+m[0].length)
            let n = parseInt(m[1])
            splits.push(left)
            if (n != n){ // not a number
                splits.push(args[m[1]])
            } else { // a numbered argument
                splits.push(args[n])
           }
        } else {
            splits.push(s)
            s = ""
        }
    }
    return splits
}

export function language(){
    let lang = ((typeof window.language === "string" ? window.language : null) || document.documentElement.lang || 'en').toLowerCase()
    let regex = new RegExp('^([\\w]+)-([\\w]+)$')
    let result = regex.exec(lang)
    if (result === null){
        return lang
    }
    return result[1]
}

function hget(d, key, defaultValue){
    let kl = key
    if (!Array.isArray(kl))
        kl = [kl]
    let cv = d
    for(let i=0;i<kl.length;i++){
        if (cv === undefined)
            return defaultValue
        if (cv instanceof Map)
            cv = cv.get(kl[i])
        else
            cv = cv[kl[i]]
    }
    if (cv === undefined)
        return defaultValue
    return cv
}

export function t(trans, lang, key, ...params){
    let kl = key
    let fallback
    if (!Array.isArray(kl))
        kl = [kl]
    let value = hget(trans, [lang, ...kl])

    // value undefined?
    if (value === undefined) {
        // search all in translation
        for (fallback of trans.keys()) {
            value = hget(trans, [fallback, ...kl]);
            // stop on first found entry in translation
            if (value !== undefined) {
                break;
            }
        }
    }

    if (value === undefined) {
        return `[missing translation: ${lang}/${kl.join("/")}]`;
    }
    if (params.length > 0) {
        return format(value, ...params)
    }
    return value
}
