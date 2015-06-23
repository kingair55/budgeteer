using Budgeteer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgeteer.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index(HomepageViewModel model)
        {
            model = (HomepageViewModel)TempData["viewModel"];
            return View(model);
        }

        [HttpPost]
        public ActionResult AddEntry(string type, int year, int month, int position, string name, int value)
        {
            return View();
        }

        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
