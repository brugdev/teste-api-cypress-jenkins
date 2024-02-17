///<reference types="cypress" />
import contrato from "../contratos/produtos.contrato";//importando contrato

describe('Teste de API em Produtos', () => {
    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })//passando os parametros para o comando customizado do token

    });

    it.only('Deve validar contrato de produto com sucesso ', () => {
        cy.request('produtos').then(response =>{
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar Produtos - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('produtos')

        })

    });

    it('Deve cadastrar Produto - POST', () => {
        let produto = 'Produto EBAC' + Math.floor(Math.random() * 100000000000)
        cy.cadastrarProduto(token, produto, 10, 'Cabo USB C', 100)//comando personalizafo
            .should((response) => {
                expect(response.status).equal(201)
                expect(response.body.message).equal('Cadastro realizado com sucesso')
            })
    });

    it('Deve validar mensagem de produto cadastrado anteriormente - POST', () => {
        cy.cadastrarProduto(token, 'Cabo USB 001', 10, 'Cabo USB C', 100)//comando personalizafo
            .should((response) => {
                expect(response.status).equal(400)
                expect(response.body.message).equal('Já existe produto com esse nome')
            })

    });

    it('Deve editar um produto com sucesso - PUT', () => {
        let produto = 'Produto EBAC EDITADO' + Math.floor(Math.random() * 100000000000)
        cy.cadastrarProduto(token, produto, 10, 'PRDUTO EBAC EDT', 100)//comando personalizafo
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'PUT',
                    url: `produtos/${id}`,
                    headers: { authorization: token },
                    body: {
                        "nome": produto,
                        "preco": 500,
                        "descricao": "Produto Editado",
                        "quantidade": 100
                    }
                }).should((response) => {
                    expect(response.status).equal(200)
                    expect(response.body.message).equal('Registro alterado com sucesso')
                })
            })


    });

    it('Deve deletar um produto com sucesso - DELETE', () => {
        cy.cadastrarProduto(token, 'Produto EBAC a ser deletado', 100, 'DELETE', 100)//comando personalizafo
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `produtos/${id}`,
                    headers: { authorization: token },

                }).should((response) => {
                    expect(response.status).equal(200)
                    expect(response.body.message).equal('Registro excluído com sucesso')
                })
            })


    });

});