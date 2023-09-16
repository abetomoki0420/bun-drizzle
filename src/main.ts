import express from "express"
import { moenyLogs } from "./db/schema"
import { db } from "./db/core"
import { eq } from "drizzle-orm"
import { z } from "zod"

const app = express()

// use json middleware to parse request body
app.use(express.json())

app.get("/", async (req, res) => {
  const moneyLogs = await db.select().from(moenyLogs).all()
  res.send(moneyLogs)
  res.status(200).json(moneyLogs)
})

app.get("/:id", async (req, res) => {
  // retrive id from req.params
  const id = z.coerce.number().safeParse(req.params.id)
  if (!id.success) {
    res.status(400).json({ message: "bad request" })
    return
  }

  // select a row from money_logs table
  const moneyLog = await db
    .select()
    .from(moenyLogs)
    .where(eq(moenyLogs.id, id.data))

  if (moneyLog.length === 0) {
    res.status(404).json({ message: "not found" })
    return
  }

  res.status(200).json(moneyLog)
})

const MoneyLogRequestBodySchema = z.object({
  amount: z.number(),
  note: z.string(),
})

app.post("/", async (req, res) => {
  // validate request body
  const result = MoneyLogRequestBodySchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: "bad request" })
    return
  }

  const { amount, note } = result.data

  // insert a new row into money_logs table
  const v = await db.insert(moenyLogs).values({ amount, note }).returning()

  // send a response
  res.status(200).json(v)
})

// define update router
app.put("/:id", async (req, res) => {
  // retrive id from req.params
  const id = z.coerce.number().safeParse(req.params.id)
  if (!id.success) {
    res.status(400).json({ message: "bad request" })
    return
  }

  // validate request body
  const result = MoneyLogRequestBodySchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: "bad request" })
    return
  }

  const { amount, note } = result.data

  // update a row in money_logs table
  const v = await db
    .update(moenyLogs)
    .set({ amount, note })
    .where(eq(moenyLogs.id, id.data))
    .returning()

  // send a response
  res.status(200).json(v)
})

app.listen(3030, () => {
  console.log("server started")
})
