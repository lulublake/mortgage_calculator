// imports
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.render("index.ejs");
});

app.post("/submit", (req,res)=>{
    const mortgageAmount = parseFloat(req.body.mortgage_amount);
    const mortgageTerm = parseFloat(req.body.mortgage_term);
    const interestRate = parseFloat(req.body.interest_rate) / 100;
    const mortgageType = req.body.mortgage_type;

    let monthlyInterest = interestRate / 12;
    let loanTermInMonths = mortgageTerm * 12;

    //Monthly payment for mortgage calc formula: P[ (r(1+r)^n) / (1+r)^n-1]
    let firstPart = monthlyInterest * Math.pow(1 + monthlyInterest, loanTermInMonths); //r(1+r)^n where r is monthly interest and n is loan term in months
    let secondPart = Math.pow(1 + monthlyInterest, loanTermInMonths) - 1;

    let monthlyMortgagePayment = mortgageAmount * (firstPart/secondPart); //where P is the principal or mortgage amount.
    let totalRepayment = loanTermInMonths * monthlyMortgagePayment;
    let totalInterest = totalRepayment - mortgageAmount;

    //formats values with commas
    function formatCurrency(number) {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    

    res.render("index.ejs", {
        //original values
        mortgageValue: mortgageAmount,
        interestRate: interestRate * 100,
        mortgageTerm: mortgageTerm,

        //results
        showResult: true,
        monthlyPayment: formatCurrency(monthlyMortgagePayment),
        repayment: formatCurrency(totalRepayment),
        interest: formatCurrency(totalInterest),
        mortgageType: mortgageType
    });
});

app.listen(port, (req, res)=>{
    console.log(`Started listening at port ${port}`);
});