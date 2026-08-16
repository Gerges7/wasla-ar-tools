(() => {
  'use strict';
  const form = document.getElementById('profitForm');
  if (!form) return;
  const fields = ['productCost','shippingCost','otherCost','targetProfit','platformFee','taxRate'];
  const get = id => Number(Wasla.toEnglishDigits(document.getElementById(id).value).replace(',', '.')) || 0;
  const method = document.getElementById('profitMethod');
  const currency = document.getElementById('currency');
  const error = document.getElementById('profitError');
  const empty = document.getElementById('emptyState');
  const result = document.getElementById('profitResult');
  const status = document.getElementById('status');

  function output(id, value) { document.getElementById(id).textContent = Wasla.formatMoney(value, currency.value); }
  function calculate() {
    error.textContent = '';
    const product = get('productCost');
    const shipping = get('shippingCost');
    const other = get('otherCost');
    const target = get('targetProfit') / 100;
    const fee = get('platformFee') / 100;
    const tax = get('taxRate') / 100;
    const totalCost = product + shipping + other;
    if (product <= 0) throw new Error('اكتب تكلفة المنتج أولًا.');
    if ([target, fee, tax].some(v => v < 0)) throw new Error('النسب لا يمكن أن تكون سالبة.');
    let subtotal;
    if (method.value === 'margin') {
      if (target + fee >= .95) throw new Error('مجموع هامش الربح وعمولة المنصة مرتفع جدًا.');
      subtotal = totalCost / (1 - target - fee);
    } else {
      const targetProfitValue = totalCost * target;
      if (fee >= .95) throw new Error('عمولة المنصة مرتفعة جدًا.');
      subtotal = (totalCost + targetProfitValue) / (1 - fee);
    }
    const feeValue = subtotal * fee;
    const taxValue = subtotal * tax;
    const customerPrice = subtotal + taxValue;
    const netProfit = subtotal - feeValue - totalCost;
    const actualMargin = subtotal ? (netProfit / subtotal) * 100 : 0;
    output('totalCostOut', totalCost);
    output('subtotalOut', subtotal);
    output('feeOut', feeValue);
    output('taxOut', taxValue);
    output('finalPriceOut', customerPrice);
    output('netProfitOut', netProfit);
    document.getElementById('marginOut').textContent = `${actualMargin.toFixed(1)}%`;
    empty.hidden = true;
    result.hidden = false;
    Wasla.setStatus(status, 'تم حساب السعر والربح.');
  }
  form.addEventListener('submit', event => { event.preventDefault(); try { calculate(); } catch (err) { error.textContent = err.message; result.hidden = true; empty.hidden = false; } });
  fields.forEach(id => document.getElementById(id).addEventListener('input', () => { document.getElementById(id).value = Wasla.toEnglishDigits(document.getElementById(id).value); }));
})();
