import { useState, useEffect } from 'react';
import TransponderIdentifier from './TransponderIdentifier';
import TransponderInventoryManager from './TransponderInventoryManager';
import ProgrammingGuideGenerator from './ProgrammingGuideGenerator';
import { transponderService } from '@/app/services/transponderService';
import { transponderInventoryService } from '@/app/services/transponderInventoryService';
import { toast } from 'react-hot-toast';

export default function TransponderManagement() {
  const [transponderData, setTransponderData] = useState([]);
  const [inventoryLevels, setInventoryLevels] = useState([]);
  const [selectedTransponder, setSelectedTransponder] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transponders, inventory] = await Promise.all([
        transponderService.getAllTransponders(),
        transponderInventoryService.getInventoryLevels()
      ]);
      setTransponderData(transponders);
      setInventoryLevels(inventory);
    } catch (error) {
      toast.error('Failed to load transponder data');
    }
  };

  const handleUpdateStock = async (id: string, quantity: number) => {
    try {
      await transponderInventoryService.updateStock(id, quantity);
      await loadData(); // Refresh data
      toast.success('Stock updated successfully');
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const handleOrderStock = async (item: TransponderInventoryItem) => {
    // Implement order logic
    toast.success(`Order placed for ${item.transponderType}`);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Transponder Lookup</h2>
          <TransponderIdentifier 
            data={transponderData}
            onSelect={setSelectedTransponder}
          />
        </div>

        {selectedTransponder && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Programming Guide</h2>
            <ProgrammingGuideGenerator
              transponder={selectedTransponder}
              inventory={inventoryLevels}
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
        <TransponderInventoryManager
          inventory={inventoryLevels}
          onUpdateStock={handleUpdateStock}
          onOrderStock={handleOrderStock}
        />
      </div>
    </div>
  );
} 