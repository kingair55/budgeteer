using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Budgeteer.Models
{
    public class YearlyUserDataViewModel
    {
        public List<Tuple<int, int, int, int>> Entries { get; set; }
    }
}