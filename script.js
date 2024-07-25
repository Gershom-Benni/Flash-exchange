document.addEventListener('DOMContentLoaded', () => {
    function setupDropdown(customSelectClass, selectSelectedClass, selectItemsClass, selectHideClass) {
        const select = document.querySelector(customSelectClass);
        const selected = document.querySelector(selectSelectedClass);
        const items = document.querySelector(selectItemsClass);

        if (!select || !selected || !items) {
            console.error('One or more dropdown elements not found.');
            return;
        }

        const itemDivs = items.querySelectorAll('div');

        selected.addEventListener('click', () => {
            items.classList.toggle(selectHideClass);
        });

        itemDivs.forEach(item => {
            item.addEventListener('click', () => {
                selected.textContent = item.textContent;
                items.classList.add(selectHideClass);
                const selectedValue = item.textContent.includes(' - ') ? item.textContent.split(' - ')[0] : item.textContent;
                selected.dataset.value = selectedValue; 
            });
        });

        document.addEventListener('click', (event) => {
            if (!select.contains(event.target)) {
                items.classList.add(selectHideClass);
            }
        });
    }

    setupDropdown('.custom-select', '.select-selected', '.select-items', 'select-hide');
    setupDropdown('.custom-select2', '.select-selected2', '.select-items2', 'select-hide2');
    setupDropdown('.custom-select3', '.select-selected3', '.select-items3', 'select-hide3');
});

async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.querySelector('.select-selected[data-value]').dataset.value;
    const toCurrency = document.querySelector('.select-selected2[data-value]').dataset.value;
    const outputFormat = document.querySelector('.select-selected3[data-value]').dataset.value;

    if (!amount || !fromCurrency || !toCurrency) {
        alert('Please fill all fields.');
        return;
    }

    const loader = document.querySelector('.loader');
    const result = document.getElementById('result');

    loader.style.display = 'block';
    result.style.display = 'none';

    const apiKey = '4d7ffa823f0f4cdca54dcc37e66a66ee'; 
    const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        fx.base = data.base;
        fx.rates = data.rates;

        let convertedAmount = fx(amount).from(fromCurrency).to(toCurrency);
        let formattedAmount = convertedAmount.toFixed(2);

        switch (outputFormat.toLowerCase()) {
            case 'crores':
                formattedAmount = accounting.formatNumber((convertedAmount / 10000000),2) + ' Crores ' + toCurrency;
                break;
            case 'millions':
                formattedAmount = accounting.formatNumber((convertedAmount / 1000000),2) + ' Million ' + toCurrency;
                break;
            case 'billions':
                formattedAmount = accounting.formatNumber((convertedAmount / 1000000000),2) + ' Billion ' + toCurrency;
                break;
            case 'lakhs':
                formattedAmount = accounting.formatNumber((convertedAmount / 100000),2) + ' Lakhs ' + toCurrency;
                break;
            default:
                formattedAmount = accounting.formatNumber(convertedAmount,2) + ' ' + toCurrency;
        }

        result.innerText = formattedAmount;
        result.style.display = 'block'; 
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
        alert('Failed to convert currency.');
    } finally {
        loader.style.display = 'none';
    }
}
