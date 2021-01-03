export const ipRegex = /\b(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\b/
const maskRegexA = /\b(255)\.(0|128|192|224|240|248|252|254)\.(0)\.(0)\b/
const maskRegexB = /\b(255)\.(255)\.(0|128|192|224|240|248|252|254)\.(0)\b/
const maskRegexC = /\b(255)\.(255)\.(255)\.(0|128|192|224|240|248|252|254)\b/

export function getAddNet(ip, mask) {
    if (!ipRegex.test(ip) || !ipRegex.test(mask))
        return null

    const [, a, b, c, d] = ipRegex.exec(ip)
    const [, aM, bM, cM, dM] = ipRegex.exec(mask)

    return [a & aM, b & bM, c & cM, d & dM].join(".")
}

export function getBroadcast(ip, mask) {
    if (!ipRegex.test(ip) || !ipRegex.test(mask) || validateMaskIp(mask, ip) === -1)
        return null

    let index = /0+/.exec(ipToBinary(mask).replace(/\s/g, "")).index
    let ipBinary = ipToBinary(ip).replace(/\s/g, "").split("")

    for (let i = index; i < ipBinary.length; i++)
        ipBinary[i] = "1"

    return ipToDecimal(ipBinary.join(""))
}

export function validateMask(mask) {
    if (maskRegexA.test(mask)) {
        return 1
    } else if (maskRegexB.test(mask)) {
        return 2
    } else if (maskRegexC.test(mask)) {
        return 3
    }
    return -1
}

export function validateMaskIp(mask, ip) {
    if (maskRegexA.test(mask) && getClass(ip) === "a") {
        return 1
    } else if (maskRegexB.test(mask) && getClass(ip) === "b") {
        return 2
    } else if (maskRegexC.test(mask) && getClass(ip) === "c") {
        return 3
    }
    return -1
}

export function getNbBitsForSubNet(mask) {
    let n = null
    if (maskRegexA.test(mask)) {
        n = maskRegexA.exec(mask)[2]
    } else if (maskRegexB.test(mask)) {
        n = maskRegexB.exec(mask)[3]
    } else if (maskRegexC.test(mask)) {
        n = maskRegexC.exec(mask)[4]
    }

    if (n && n !== '0') {
        let binaryFormat = toBinary(Number(n))
        let res = /\b1+/.exec(binaryFormat)
        if (res) {
            return res[0].length
        }
    } else if (n === '0') {
        return 0
    } else {
        return null
    }
}

export function ipToBinary(ip) {
    if (! ipRegex.test(ip))
        return null
    const [, a, b, c, d] = ipRegex.exec(ip)
    return [toBinary(Number(a)), toBinary(Number(b)), toBinary(Number(c)), toBinary(Number(d))].join("  ")
}

export function getClass(ip) {
    if (ipRegex.exec(ip)) {
        const [, a,] = ipRegex.exec(ip)
        let binaryIp = toBinary(a)
        if (binaryIp.substr(0, 1) === "0") {
            return "a"
        } else if (binaryIp.substr(0, 2) === "10") {
            return "b"
        } else if (binaryIp.substr(0, 3) === "110")
            return "c"
        else if (binaryIp.substr(0, 4) === "1110")
            return "d"
    }
    return ""
}

export function getMaskClass(mask) {
    if (maskRegexA.test(mask)) {
        return "a"
    } else if (maskRegexB.test(mask)) {
        return "b"
    } else if (maskRegexC.test(mask)) {
        return "c"
    }
    return ""
}

function toBinary(number) {
    let total = 0
    let positions = new Array(8).fill(0)

    for (let i = 7; i >= 0; i--) {
        if (Math.pow(2, i) + total <= number) {
            positions[i] = 1
            if ((total += Math.pow(2, i)) === number)
                break
        }
    }

    return positions.reverse().join("")
}

function toDecimal(number) {
    let total = 0
    number = number.split("").reverse().join("")

    for (let i = 0; i < number.length; i++) {
        if (number[i] === "1")
            total += Math.pow(2, i)
    }

    return total
}

function ipToDecimal(ip) {
    let reg = /((0|1){8})((0|1){8})((0|1){8})((0|1){8})/
    const [, a,, b,, c,, d] = reg.exec(ip)

    return [toDecimal(a), toDecimal(b), toDecimal(c), toDecimal(d)].join(".")
}

function getDefaultMask(ip) {
    const ipClass = getClass(ip)
    if (ipClass === "a") {
        return "255.0.0.0"
    } else if (ipClass === "b") {
        return "255.255.0.0"
    } else if (ipClass === "c") {
        return "255.255.255.0"
    } else {
        return null
    }
}

export function nbSubNetsToMask(nbSubNets, ip) {
    if (! ipRegex.test(ip) || nbSubNets < 1 || nbSubNets > 128)
        return null

    let i;
    for (i = 0;;i++) {
        if (Math.pow(2, i) >= nbSubNets)
            break;
    }
    let decimalNumber = "1".repeat(i) + "0".repeat(8 - i)
    let mask = getDefaultMask(ip)
    if (mask !== "") {
        mask = mask.replace(/0/, toDecimal(decimalNumber))
    }

    return mask
}
