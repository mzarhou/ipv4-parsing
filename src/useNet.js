import { useMemo } from 'react'


import {
    ipRegex,
    getAddNet,
    getClass,
    getNbBitsForSubNet,
    ipToBinary,
    validateMask,
    getBroadcast,
    validateMaskIp,
    getMaskClass
} from './utils'


export default function useNet(ip, mask) {

    const validIp =  useMemo(() => ipRegex.test(ip), [ip])
    const ipBinary =  useMemo(() => ipToBinary(ip), [ip])
    const ipClass =  useMemo(() => getClass(ip).toUpperCase(), [ip])

    const maskClass =  useMemo(() => getMaskClass(mask).toUpperCase(), [mask])
    const nbUnusedGroups =  useMemo(() => 3 - validateMask(mask), [mask])
    const validMask =  useMemo(() => validateMask(mask) !== -1, [mask])
    const maskBinary =  useMemo(() => ipToBinary(mask), [mask])
    const nbUsedBits =  useMemo(() => getNbBitsForSubNet(mask), [mask])

    const addNet =  useMemo(() => getAddNet(ip, mask), [ip, mask])
    const validMaskIp =  useMemo(() => validateMaskIp(mask, ip) !== -1, [ip, mask])
    const broadcast =  useMemo(() => getBroadcast(ip, mask), [ip, mask])

    const subNetInc =  useMemo(() => Math.pow(2, 8 - nbUsedBits), [nbUsedBits])
    const possibleSubNets =  useMemo(() => Math.pow(2, nbUsedBits), [nbUsedBits])
    const possibleMachines =  useMemo(() => Math.pow(2, 8 - nbUsedBits + 8 * nbUnusedGroups) - 2, [nbUsedBits, nbUnusedGroups])

    return {
        validIp,
        ipBinary,
        ipClass,
        maskClass,
        nbUnusedGroups,
        validMask,
        validMaskIp,
        maskBinary,
        addNet,
        nbUsedBits,
        broadcast,
        subNetInc,
        possibleSubNets,
        possibleMachines,
    }
}
