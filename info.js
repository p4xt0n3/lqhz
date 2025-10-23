// info.js
// shows a delayed overlay when cursor hovers over a catalog-item for 2s
export function initInfoOverlay(container) {
  if (!container) return;

  const meta = {
    P1: { name: '血尘天骄 vs 伪人科学家', date: '30/07/25' },
    P2: { name: '献祭浮木说是', date: '01/08/25' },
    P3: { name: 'cs刀客塔', date: '02/08/25' },
    P4: { name: '依旧（）（）', date: '03/08/25' },
    P5: { name: 'AUT pvp现状', date: '03/08/25' },
    P6: { name: '必须有求必应', date: '04/08/25' },
    P7: { name: '作者疯了', date: '04/08/25' },
    P8: { name: '666还是川剧', date: '05/08/25' },
    P9: { name: '请输入文本', date: '07/08/25' },
    P10: { name: '666被反杀了', date: '07/08/25' },
    P11: { name: '⭕💰群殴', date: '08/08/25' },
    P12: { name: '燃尽了', date: '09/08/25' },
    P13: { name: '制裁', date: '10/08/25' },
    P14: { name: '逃脱发情恶魔 上', date: '11/08/25' },
    P15: { name: '逃脱发情恶魔 中', date: '12/08/25' },
    P16: { name: '逃脱发情恶魔 下', date: '13/08/25' },
    P17: { name: '⭕💰', date: '14/08/25' },
    P18: { name: '天上天下，唯⭕独尊', date: '15/08/25' },
    P19: { name: '有一个死神前来买瓜', date: '17/08/25' },
    P20: { name: '天上掉下来个乖女儿', date: '18/08/25' },
    P21: { name: '和蔼可亲的兄妹', date: '19/08/25' },
    P22: { name: '制裁小仙女', date: '20/08/25' },
    P23: { name: '大卫戴', date: '21/08/25' },
    P24: { name: '非洲之旅', date: '22/08/25' },
    P25: { name: '⭕④你⑧了', date: '24/08/25' },
    P26: { name: '强大对手', date: '26/08/25' },
    P27: { name: '⭕💰好，⭕💰秒，天天⭕💰身体棒', date: '27/08/25' },
    P28: { name: '最喜欢的人', date: '29/08/25' },
    P29: { name: '求婚失败', date: '04/09/25' },
    P30: { name: '见色忘友', date: '06/09/25' },
    P31: { name: '白挨一顿打', date: '09/09/25' },
    P32: { name: '传授', date: '10/09/25' },
    P33: { name: '对峙', date: '11/09/25' },
    P34: { name: '离去', date: '12/09/25' },
    P35: { name: '通知', date: '13/09/25' },
    P36: { name: '大赛前夕', date: '15/09/25' },
    P37: { name: '第一回合：莱克萨斯 VS 杰尼提', date: '16/09/25' },
    P38: { name: '第二回合：内森 VS 琼斯', date: '17/09/25' },
    P39: { name: '第三回合：秋太甚原 VS 克林顿', date: '19/09/25' },
    P40: { name: '结算', date: '22/09/25' },
    P41: { name: '⭕💰炸膛', date: '23/09/25' },
    P42: { name: '挑战', date: '24/09/25' },
    P43: { name: '⭕实力', date: '25/09/25' },
    P44: { name: '一百亿', date: '26/09/25' },
    P45: { name: '酒后吐真言', date: '27/09/25' },
    P46: { name: '好砍兄弟好砍', date: '29/09/25' },
    P47: { name: '领域展开', date: '30/09/25' },
    P48: { name: '出门', date: '01/10/25' },
    P49: { name: '我杀我自己', date: '02/10/25' },
    P50: { name: '劲敌', date: '03/10/25' },
    P51: { name: '黑闪', date: '04/10/25' },
    P52: { name: '被迫', date: '06/10/25' },
    P53: { name: '你的错', date: '07/10/25' },
    P54: { name: '🈲⭕', date: '08/10/25' },
    P55: { name: '驱逐', date: '09/10/25' },
    P56: { name: '小孩都⭕', date: '10/10/25' },
    P57: { name: '宴会', date: '11/10/25' },
    P58: { name: '战书', date: '11/10/25' },
    P59: { name: '分手', date: '12/10/25' },
    P60: { name: '解释', date: '13/10/25' },
    P61: { name: '大⭕', date: '14/10/25' },
    P62: { name: '早八🕗', date: '15/10/25' },
    P63: { name: '俩⭕神', date: '16/10/25' },
    P64: { name: '润', date: '16/10/25' }, 
    P65: { name: '惨', date: '17/10/25' },
    P66: { name: '⭕错人', date: '19/10/25' },
    P67: { name: '打④你⑧了', date: '20/10/25' },
    P68: { name: '崩飞', date: '21/10/25' },
    P69: { name: '真可爱啊', date: '22/10/25'}
  };

  let timer = null;
  let overlay = null;
  let activeTarget = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'info-overlay';
    overlay.setAttribute('role', 'status');
    document.body.appendChild(overlay);
    return overlay;
  }

  function showForTarget(target) {
    if (!target) return;
    const id = target.textContent && target.textContent.trim();
    const data = meta[id];
    if (!data) return;
    const ol = ensureOverlay();
    ol.innerHTML = `<div>${data.name}</div><div style="margin-top:6px;font-size:12px;opacity:0.9">${data.date}</div>`;
    // compute position near element (above-right by default)
    const rect = target.getBoundingClientRect();
    const left = Math.min(window.innerWidth - 20, rect.right + 8);
    const top = Math.max(8, rect.top + (rect.height/2) - 24);
    ol.style.left = `${left}px`;
    ol.style.top = `${top}px`;
    // trigger visible class
    requestAnimationFrame(() => ol.classList.add('visible'));
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.remove('visible');
    // remove after transition
    setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      overlay = null;
    }, 260);
  }

  function onPointerEnter(e) {
    const btn = e.target.closest('.catalog-item');
    if (!btn) return;
    activeTarget = btn;
    clearTimeout(timer);
    timer = setTimeout(() => {
      // only show if pointer still over same element
      if (activeTarget === btn) showForTarget(btn);
    }, 500);
  }
  function onPointerLeave(e) {
    const related = e.relatedTarget;
    const leftBtn = e.target.closest('.catalog-item');
    if (leftBtn && leftBtn === activeTarget) activeTarget = null;
    clearTimeout(timer);
    // if overlay visible, hide it
    hideOverlay();
  }

  container.addEventListener('pointerenter', onPointerEnter, true);
  container.addEventListener('pointerleave', onPointerLeave, true);
}
