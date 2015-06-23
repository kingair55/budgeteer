using Budgeteer.DAL;
using Budgeteer.Models;
using Budgeteer.Utilities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Budgeteer.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        public BudgeteerDbContext DbContext
        {
            get
            {
                return new BudgeteerDbContext();
            }
        }
        //
        // GET: /Home/

        public ActionResult Index(HomepageViewModel model)
        {
            model = (HomepageViewModel)TempData["viewModel"];
            return View(model);
        }

        [HttpPost]
        public JsonResult AddEntry(int type, int year, int month, int position, string name, int value, string username)
        {
            DbContext.Entries.Add(new Entry { UserId = DbContext.Users.FirstOrDefault(u => u.UserName.Equals(username)).Id, Type = (EntryType)1, Year = year, Month = month, Position = position, Name = name, Value = value });
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
