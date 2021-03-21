import { useState, useEffect, useMemo } from 'react';
import { nbSubNetsToMask, validateMask, isNumeric } from './utils'
import useNet from './useNet'
import Notifications from './components/app/Notifications'
import useDoubleClickCopy from './composables/useDoubleClickCopy';
import cx from 'classnames';


function App() {
  const handleDoubleClick = useDoubleClickCopy();

  const [ip, setIp] = useState("192.168.1.1");
  const [mask, setMask] = useState("")
  const [maskOrNbSubNets, setMaskOrNbSubNets] = useState("255.255.255.192")
  const isMask = useMemo(() => validateMask(maskOrNbSubNets) !== -1, [maskOrNbSubNets])
  const isNumber = useMemo(() => isNumeric(maskOrNbSubNets), [maskOrNbSubNets])

  useEffect(() => {
    setMask(() =>
      Number(maskOrNbSubNets) || Number(maskOrNbSubNets) === 0
      ? nbSubNetsToMask(maskOrNbSubNets, ip)
      : maskOrNbSubNets
    )
  }, [maskOrNbSubNets, ip])

  const {
    validIp, validMask, validMaskIp,
    ipBinary, ipClass,
    maskBinary, maskClass,
    addNet, broadcast,
    nbUsedBits, subNetInc, possibleSubNets, nbUnusedGroups, possibleMachines
  } = useNet(ip, mask)

  const dataMask = useMemo(() => [
    { text: "Mask", value: mask, show: isNumber && maskOrNbSubNets > 0 && maskOrNbSubNets < 129},
    { text: "La classe (IP)", value: ipClass, show: validIp },
    { text: "Ip en binaire", value: ipBinary, show: validIp },
    { text: "Masque en binaire", value: maskBinary, show: validMask },
    { text: "La classe (Masque)", value: maskClass, show: !validMaskIp && validMask },
    { text: "@Reseau", value: addNet, show: validMaskIp},
    { text: "@Broadcast", value: broadcast, show: validMaskIp},
    { text: "Nb bits SR", value: nbUsedBits, show: validMask && nbUsedBits > 0},
    { text: "Incrementation SR", value: subNetInc, show: validMask && nbUsedBits > 0},
    {
      text: "Nb SR possible",
      value: "2^" + nbUsedBits + " = " + possibleSubNets,
      show: validMask && nbUsedBits > 0 && isMask
    },
    {
      text: "Nb machines possible",
      value: "2^" + (8 - nbUsedBits + 8 * nbUnusedGroups )+ " - 2 = " + possibleMachines,
      show: validMask && nbUsedBits > 0
    }
  ], [mask, maskOrNbSubNets, isNumber, ipClass, validIp, ipBinary, maskBinary, validMask, maskClass, validMaskIp, addNet, broadcast, nbUsedBits, subNetInc, possibleSubNets, isMask, nbUnusedGroups, possibleMachines])

  return (
    <div className="flex flex-col max-w-2xl min-h-screen px-4 mx-auto">
      <Notifications />
      <div className="flex-auto mt-10">
        <input value={ip} placeholder="IP" onChange={(e) => setIp(e.target.value)}
          className={cx({'border-green-500': validMaskIp}, 'block w-full px-4 py-2 text-xl border rounded-sm')}
        />
        <input value={maskOrNbSubNets} onChange={(e) => setMaskOrNbSubNets(e.target.value)} placeholder="Masque ou nombre de sous-reseaux"
          className={cx({'border-green-500': validMaskIp}, 'block w-full px-4 py-2 mt-4 text-xl border rounded-sm')}
        />
        <div className="mt-8 overflow-x-auto font-mono">
          <table className="w-full">
            <tbody>
            {dataMask.filter(i => i.show).map((item, index) => (
              <tr className="border border-gray-400" key={index}>
                <td className="p-1 tracking-tight select-none">{ item.text }</td>
                <td className="p-1 whitespace-no-wrap border-l select-none"
                  onDoubleClick={(e) => handleDoubleClick(item.value, e.target)}
                >{ item.value }</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      <ul className="mt-2 text-xs text-gray-600">
        <li>- nb: nombre de</li>
        <li>- @ : addresse</li>
        <li>- SR: sous-reseau</li>
      </ul>
    </div>
  );
}

export default App;
