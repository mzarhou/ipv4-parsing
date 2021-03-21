import { useNotifications } from '../context/notifications-context';

function copyToCliboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

//
function animateTarget(target, bgColor) {
  target.classList.toggle(bgColor)
  setTimeout(() => target.classList.toggle(bgColor), 250)
}

export default function useDoubleClickCopy () {
  const [, notify] = useNotifications();

  const handleDoubleClick = (value, target) => {
    copyToCliboard((value + "").replace(/\s/g, ""))
      || animateTarget(target, "bg-green-200")
      || notify(`copied`);
  }

  return handleDoubleClick;
}
