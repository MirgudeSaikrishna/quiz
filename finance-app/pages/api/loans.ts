import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Loan from '../../models/Loan';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET': {
      const loans = await Loan.find({}).lean();
      return res.status(200).json(loans);
    }
    case 'POST': {
      try {
        const loan = await Loan.create(req.body);
        return res.status(201).json(loan);
      } catch (error) {
        return res.status(400).json({ message: 'Error creating loan', error });
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}