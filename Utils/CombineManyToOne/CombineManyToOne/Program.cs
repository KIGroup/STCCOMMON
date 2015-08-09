using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace CombineManyToOne
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                StreamReader inputFile = new StreamReader("listOfFilesForCombine.js");
                string str = inputFile.ReadLine();

                List<string> files = new List<string>();
                while (!String.IsNullOrEmpty(str))
                {
                    files.Add(str);
                    str = inputFile.ReadLine();
                }


                inputFile.Close();
                CombineFiles(files);

                Console.WriteLine("Объединение файлов завершено!");
            }
            catch(Exception ex)
            {
                Console.WriteLine("Ошибка!" + ex.Message + "\n" + ex.StackTrace);
            }

            Console.ReadKey();
        }

        static void CombineFiles(List<string> files)
        {
            StreamWriter combineFile = new StreamWriter("combine.js");
            combineFile.WriteLine("// Combine date time is " + DateTime.Now.ToString() + "\n");
            for (int i = 0; i < files.Count; i++)
            {
                string jsFileName = files[i];
                Console.WriteLine("Чтение файла #" + (i + 1).ToString() + ". " + jsFileName);
                combineFile.WriteLine("\n// ===============================================================================================================================");
                combineFile.WriteLine("// File: " + (i + 1).ToString() + ". " + jsFileName);
                combineFile.WriteLine("// ===============================================================================================================================");
                
                StreamReader jsFile = new StreamReader(jsFileName);

                string str = jsFile.ReadLine();
                while (str != null)
                {
                    combineFile.WriteLine(str);
                    str = jsFile.ReadLine();
                }

                jsFile.Close();
            }

            combineFile.Close();
        }
    }
}
