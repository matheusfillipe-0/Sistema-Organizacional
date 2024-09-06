document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#mainForm")
    const exibir = document.querySelector("#output")
    const total = document.querySelector("#total")
    const percentual = document.querySelector("#percentual")
    const dif = document.querySelector("#dif")
    const copyAllButton = document.getElementById("copyAllButton")
    const pdfButton = document.getElementById("generatePDF")
    const userName = localStorage.getItem("userName")
    
    // Preencher a data atual no campo de data
    const dateInput = document.getElementById("inDate")
    const today = new Date().toISOString().split('T')[0]
    dateInput.value = today

    let desc = []
    let val = []

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const nome = form.innome.value
        const valor = parseFloat(form.inValor.value.replace(',', '.'))
        const vt = parseFloat(form.invt.value)

        if (isNaN(valor) || isNaN(vt)) {
            alert("Por favor, insira valores numéricos válidos.")
            return
        }

        desc.push(nome)
        val.push(valor)
        let linha = ""

        let soma = val.reduce((total, valor) => total + valor, 0)
        let percentualDesconto = ((soma / vt) * 100).toFixed(2)
        let dife = vt - soma

        for (let i = 0; i < desc.length; i++) {
            linha += `${desc[i]} -- R$ ${val[i].toFixed(2)}\n`
        }

        const resume = `TOTAL DE GASTOS: R$ ${soma.toFixed(2)}`

        exibir.innerText = linha
        total.innerText = resume
        percentual.innerText = `Comprometimento da Renda: ${percentualDesconto}%`
        dif.innerText = `Saldo Atual: R$ ${dife.toFixed(2)}`
        if (desc.length > 0) {
            exibir.style.display = 'block'
        }

        form.innome.value = ""
        form.inValor.value = ""
        form.innome.focus()
    })

    copyAllButton.addEventListener("click", () => {
        const preText = exibir.innerText
        const totalText = total.innerText
        const percentualText = percentual.innerText
        const difText = dif.innerText
        const allText = `${preText}\n${totalText}\n${percentualText}\n${difText}`

        // Cria um elemento textarea temporário para copiar o texto
        const textarea = document.createElement("textarea")
        textarea.value = allText
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)

        alert("Texto copiado com sucesso! Obrigado por seu acesso!")
    })

    pdfButton.addEventListener("click", () => {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

        // Adiciona o título do documento
        doc.setFontSize(18)
        doc.text("Olá " + userName + ":)  segue abaixo o relatório dos dados:", 10, 10)

        // Adiciona o conteúdo do resultado
        doc.setFontSize(12)
        const preText = exibir.innerText
        const totalText = total.innerText
        const percentualText = percentual.innerText
        const difText = dif.innerText
        const allText = `${preText}\n${totalText}\n${percentualText}\n${difText}`
        
        // Adiciona o conteúdo no PDF
        const splitText = doc.splitTextToSize(allText, 180) // Ajuste o tamanho conforme necessário
        doc.text(splitText, 10, 20)

        // Adiciona a data atual ao nome do arquivo
        const date = new Date()
        const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
        const fileName = `relatorio_gastos_${formattedDate}.pdf`

        // Salva o PDF
        doc.save(fileName)
    })
})
