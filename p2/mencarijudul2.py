import requests
from bs4 import BeautifulSoup
import os
from datetime import datetime


def scraping_kompas_to_file():

    url = "https://www.kompas.com/tag/inet"

    response = requests.get(url)

    if response.status_code == 200:

        soup = BeautifulSoup(response.text, 'html.parser')

        daftar_berita = soup.select('a.article__link')

        hasil = []

        for berita in daftar_berita[:10]:

            hasil.append(f"Judul: {berita.text.strip()}")
            hasil.append(f"Link : {berita['href']}")
            hasil.append("")

        folder = "Scraping_Data"

        if not os.path.exists(folder):
            os.makedirs(folder)

        tanggal = datetime.now().strftime("%Y_%m_%d")

        nama_file = f"hasil_{tanggal}.txt"

        path_file = os.path.join(folder, nama_file)

        with open(path_file, 'w', encoding='utf-8') as file:
            file.write('\n'.join(hasil))

        for baris in hasil:
            print(baris)

        print("Data berhasil disimpan!")

    else:
        print("Gagal terhubung ke website")


scraping_kompas_to_file()