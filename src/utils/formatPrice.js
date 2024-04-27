export function formatPrice(value) {
    // Convertit la chaîne en nombre si c'est une chaîne
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numberValue)) {
        return "Valeur non disponible";
    }

    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        currencyDisplay: 'narrowSymbol' // Utilisez 'narrowSymbol' pour une représentation plus compacte si disponible
    });

    let formattedPrice = formatter.format(value);

    // Remplacer "F CFA" par "CFA" dans la chaîne résultante
    formattedPrice = formattedPrice.replace('F\u202F', '');

    return formattedPrice;
}
