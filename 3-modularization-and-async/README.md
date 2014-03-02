# Modularização e Async em NodeJS

## Modularização

-   Não alteram o escopo global.
-   Permite que o desenvolvedor selecione quais funções e variáveis serão expostas à aplicação.

Módulos podem ser arquivos únicos ou diretórios inteiros contendo um ou mais arquivos. Se for um diretório, o arquivo que será avaliado, no caso, será (comunmente o index.js).

Para o caso de um módulo típico, basta criar um arquivo que define propriedades no objeto `exports.funcao = function () {...};`.

Para o caso em que desejamos exportar um Objeto inteiro criado por nós, devemos então utilizar do `module.exports = Objeto`.

O que de fato é exportado é o `module.exports.exports`, que é inicialmente setado simplesmente como uma referência global para `module.exports`, que é definido como um objeto vazio para que o usuário possa adicionar propriedades. Deste forma, `exports.myFunc` é apenas uma simplificação para `module.exports.myFunc`.

Módulos cujo destino não é especificado serão buscados no node_modules do projeto, primeiramente. Caso não seja encontrado, então no NODE\_PATH.

Módulos são cacheados pelo Node. Havendo dois arquivos numa aplicação que requerem o mesmo módulo, o primeiro require irá armazenar os dados e então em próximos requires estes dados serão retornados direto da memória.

## Async

### callbacks

De modo geral, definem lógica para respostas diretas após o processamento de algo. Trata-se de uma função, passada como argumento para uma função assíncrona, que descreve o que fazer após a realização da função assíncrona.

Por convenção, módulos node usam callbacks com dois argumentos: error e resultado. p.ex:

```prettyprint lang-javascript
var fs = require('fs');
fs.readFile('./titles.json', function (err, data) {
    if (err) {
        throw err;
    } else {
        // perform something.
    }
});
```

São apropriados para execução de tarefas assíncronas de chamada única mas podem acabar se tornando um problema caso haja grande encadeamento dos mesmos.

### event listeners e emitters

Emitters enviam eventos e inclue a habilidade de "segurar" tais eventos quando atirados. Listener é uma associação entre um evento e uma função de callback que é chamada cada vez que o evento ocorre.

Podem ser interessantes para organizar a lógica assíncrona dado que eles permitem a associação com conceito de ouvintes para determinados eventos que executam determinadas tarefas dado o lançamento de tais eventos.

```prettyprint lang-javascript
socket.on('data', function (data) {
    // do something cool with data :P
});
```


### Flow control

Nos permite manusear como tarefas assíncronas executam, ou uma atrás da outra ou simultaneamente. Implementar seu próprio flow-control é totalmente possível mas há bibliotecas já prontas para isto.
