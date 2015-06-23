using Budgeteer.Utilities.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Budgeteer.Models
{
    public class Entry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid EntryId { get; set; }

        public string UserId { get; set; }
        public EntryType Type { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int Position { get; set; }
        public string Name { get; set; }
        public int Value { get; set; }
    }
}