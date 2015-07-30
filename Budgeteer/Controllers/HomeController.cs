using Budgeteer.DAL;
using Budgeteer.Models;
using Budgeteer.Utilities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Budgeteer.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        // GET: /Home/

        public ActionResult Index()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            var userId = string.Empty;
            Claim userIdClaim = null;
            var viewModel = new HomepageViewModel();
            var DbContext = new BudgeteerDbContext();

            if (claimsIdentity != null)
            {
                // the principal identity is a claims identity.
                // now we need to find the NameIdentifier claim
                userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    userId = userIdClaim.Value;
                }
            }            
            viewModel.Entries = DbContext.Entries.Where(e => e.UserId.Equals(userId) && e.Month == DateTime.Now.Month && e.Year == DateTime.Now.Year).ToList();

            return View(viewModel);
        }

        public ActionResult ChangeFrequencyFilter(string frequency)
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            var userId = string.Empty;
            Claim userIdClaim = null;
            var viewModel = new YearlyUserDataViewModel();
            var DbContext = new BudgeteerDbContext();

            if (claimsIdentity != null)
            {
                // the principal identity is a claims identity.
                // now we need to find the NameIdentifier claim
                userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    userId = userIdClaim.Value;
                }
            }
            List<int> years = DbContext.Entries.Select(e => e.Year).Distinct().ToList<int>();
            years.Sort();

            foreach (var year in years)
            {
                int totalIncome = DbContext.Entries.Where(e => e.Year == year && e.UserId == userId && e.Type == EntryType.Income).Select(e => e.Value).Aggregate((a, b) => b + a);
                int totalExpense = DbContext.Entries.Where(e => e.Year == year && e.UserId == userId && e.Type == EntryType.Expense).Select(e => e.Value).Aggregate((a, b) => b + a);

                viewModel.Entries.Add(new Tuple<int, int, int, int>(year, totalIncome + totalExpense, totalIncome, totalExpense));
            }

            return PartialView("_UserDataYearly", viewModel);
        }

        public ActionResult UpdateEntries(int month, int year)
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            var userId = string.Empty;
            Claim userIdClaim = null;
            var viewModel = new HomepageViewModel();
            var DbContext = new BudgeteerDbContext();

            if (claimsIdentity != null)
            {
                // the principal identity is a claims identity.
                // now we need to find the NameIdentifier claim
                userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    userId = userIdClaim.Value;
                }
            }
            viewModel.Entries = DbContext.Entries.Where(e => e.UserId.Equals(userId) && e.Month == month && e.Year == year).ToList();

            return PartialView("_UserDataMonthly", viewModel);
        }

        [HttpPost]
        public JsonResult AddEntry(int type, int year, int month, int position, string name, int value, string username)
        {
            BudgeteerDbContext DbContext = new BudgeteerDbContext();
            var user = DbContext.Users.FirstOrDefault(u => u.UserName.Equals(username));
            var entry = new Entry { UserId = DbContext.Users.FirstOrDefault(u => u.UserName.Equals(username)).Id, Type = (EntryType)type, Year = year, Month = month, Position = position, Name = name, Value = value };
            DbContext.Entries.Add(entry);
            var result = DbContext.SaveChanges();
            return Json(result == 1 ? "success" : "failure");
        }

        [HttpPost]
        public JsonResult UpdateEntry(int year, int month, int type, int position, string name, int value, string username)
        {
            BudgeteerDbContext DbContext = new BudgeteerDbContext();
            var entryType = (EntryType)type;
            var userId = DbContext.Users.FirstOrDefault(u => u.UserName.Equals(username)).Id;

            var entry = new Entry { UserId = userId, Type = entryType, Year = year, Month = month, Position = position, Name = name, Value = value };

            var entryToUpdate = DbContext.Entries.First(e =>e.Year == year && e.Month == month && e.Type == entryType && e.UserId == userId && e.Position == position);

            entry.EntryId = entryToUpdate.EntryId;

            DbContext.Entry(entryToUpdate).CurrentValues.SetValues(entry);

            if(!DbContext.ChangeTracker.HasChanges())
                return Json("success");

            var result = DbContext.SaveChanges();
            return Json(result == 1 ? "success" : "failure");
        }

        [HttpPost]
        public JsonResult DeleteEntry(int year, int month, int type, int position, string username)
        {
            BudgeteerDbContext DbContext = new BudgeteerDbContext();
            var userId = DbContext.Users.First(u => u.UserName == username).Id;
            var entryToDelete = DbContext.Entries.First(e => e.Year == year && e.Month == month && e.Type == (EntryType)type && e.Position == position && e.UserId == userId);

            DbContext.Entries.Remove(entryToDelete);
            
            var result = DbContext.SaveChanges();

            return Json(result == 1 ? "success" : "failure");
        }

        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
