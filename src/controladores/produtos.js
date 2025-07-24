const produtos = require('../bancodedados/produtos');
const { getCityFromZipcode, getStateFromZipcode } = require('utils-playground');

const buscarProdutos = async (req, res) => {
    return res.json(produtos);
}

const detalharProduto = async (req, res) => {
    const { idProduto } = req.params;

    const produto = produtos.find(produto => produto.id === Number(idProduto));

    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    return res.json(produto);
}

const calcularFrete = async (req, res) => {
    const { idProduto, cep } = req.params;

    const produto = produtos.find(produto => produto.id === Number(idProduto));

    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    const estado = await getStateFromZipcode(cep);

    let valorFrete = 0;

    if (estado === 'SP' || estado === 'RJ') {
        valorFrete = produto.valor * 0.15;

        return res.json({
            produto,
            estado,
            frete: valorFrete
        });
    }

    if (estado === 'BA' || estado === 'SE' || estado === 'AL' || estado === 'PE' || estado === 'PB') {
        valorFrete = produto.valor * 0.1;
    } else {
        valorFrete = produto.valor * 0.12;
    }

    const valorTotal = produto.valor + valorFrete;

    return res.json({
        produto,
        estado,
        frete: valorFrete,
        total: valorTotal
    });
}

module.exports = {
    buscarProdutos,
    detalharProduto,
    calcularFrete
}