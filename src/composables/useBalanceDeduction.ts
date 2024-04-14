
export function useBalanceDeduction() {
    interface Tariff {
        startHour: number;
        endHour: number;
        pricePerHour: number;
    }

    const tariffs: Tariff[] = [
        { startHour: 0, endHour: 7, pricePerHour: 2 },
        { startHour: 7, endHour: 18, pricePerHour: 3 },
        { startHour: 18, endHour: 24, pricePerHour: 2.5 }
    ];

    function calculateParkingCost(entryTime: number, exitTime: number): number {
        const entryDate = new Date(entryTime);
        const exitDate = new Date(exitTime);
      
        const entryYear = entryDate.getFullYear();
        const entryMonth = entryDate.getMonth();
        const entryDay = entryDate.getDate();
        const exitYear = exitDate.getFullYear();
        const exitMonth = exitDate.getMonth();
        const exitDay = exitDate.getDate();
      
        let totalCost = 0;
      
        // Calculate the total number of days between entry and exit dates
        const currentDate = new Date(entryYear, entryMonth, entryDay);
        while (currentDate <= exitDate) {
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();
          const currentDay = currentDate.getDate();
          const isEntryDay = currentYear === entryYear && currentMonth === entryMonth && currentDay === entryDay;
          const isExitDay = currentYear === exitYear && currentMonth === exitMonth && currentDay === exitDay;
          const startHour = isEntryDay ? entryDate.getHours() : 0;
          const endHour = isExitDay ? exitDate.getHours() : 24;
      
          // Calculate the parking cost for each hour of the current day
          for (let hour = startHour; hour <= endHour; hour++) {
            const tariff = tariffs.find(tariff => hour >= tariff.startHour && hour < tariff.endHour);
            // console.log(tariff)
            if (tariff) {
              totalCost += tariff.pricePerHour;
            } else {
              // Default rate if no tariff matches
              totalCost += 1;
            }
          }
      
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
      
        return totalCost;
      }
    return{
        calculateParkingCost,
    }
}
