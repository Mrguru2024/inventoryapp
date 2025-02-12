import { prisma } from "@/lib/prisma";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Key as KeyIcon, MoreHorizontal, Plus, Search } from "lucide-react";

export default async function KeysPage() {
  const keys = await prisma.key.findMany({
    include: {
      _count: {
        select: {
          checkouts: true,
          orderItems: true,
        },
      },
    },
    orderBy: {
      manufacturer: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Key Inventory</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Key
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search keys..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            Filter
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FCC ID</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Total Checkouts</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.fccId}</TableCell>
                <TableCell>{key.manufacturer}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    key.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-700'
                      : key.status === 'CHECKED_OUT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {key.status}
                  </span>
                </TableCell>
                <TableCell>{key.frequency}</TableCell>
                <TableCell>{key.battery}</TableCell>
                <TableCell>{key._count.checkouts}</TableCell>
                <TableCell>{key._count.orderItems}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Key</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete Key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 