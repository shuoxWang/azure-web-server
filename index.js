
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Client as KustoClient, KustoConnectionStringBuilder } from "azure-kusto-data";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT|| 8080;

const {
    CLUSTER_URI,
    CLIENT_ID,
    CLIENT_SECRET,
    TENANT_ID,
} = process.env;

const connectionString = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
    CLUSTER_URI,
    CLIENT_ID,
    CLIENT_SECRET,
    TENANT_ID
);

const kustoClient = new KustoClient(connectionString);
// console.log(kustoClient);

app.post("/query-kusto", async (req, res) => {
    const { kqlQuery } = req.body;
    console.log(kqlQuery);
    try {
        //performance, load data method change
        const results = await kustoClient.execute("FinancialInsights", kqlQuery);
        // for (let row of results.primaryResults[0]._rows) {
        //     console.log(row);
        //   }
        res.json(results.primaryResults[0])
        //res.send(results.primaryResults[0][0]["Welcome"].toString())
    } catch (error) {
        console.error("Error!");
        res.status(500).json({error: error.message});
    }
});

app.listen(port, () => {
    console.log("Running!");
})