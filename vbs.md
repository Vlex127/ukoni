# Toyota Pricing App (CSC 207 Group 3)

### Project Overview

**Title:** Design and Implementation of a Vehicle Cost Estimation Application
**Case Study:** Toyota Cars

This Visual Basic 6.0 application calculates the final selling price of a Toyota vehicle. It automates the pricing process by considering the engine size, year of manufacture, import duty percentage, and additional luxury facilities (AC and Sunroof).

**Project File:** `Toyota Pricing App.vbp`
**Main Form:** `CSC_207_GROUP_3.frm`
**Splash Screen:** `frmSplash.frm`

---

### Features

* **Splash Screen:** A startup screen that automatically transitions to the main calculator.
* **Input Validation:** Prevents crashes by ensuring the user enters valid numbers.
* **Dynamic Pricing Logic:**
* **Base Price:** €5,000,000.
* **Engine Surcharge:** +€500,000 if engine size > 2.0.
* **Age Discount:** -€200,000 if manufactured before 2015.
* **Facilities:** Adds cost for AC (€50,000) and Sunroof (€150,000).
* **Duty Calculation:** Applies tax percentage to the total value.


* **Reset Function:** Clears the form for a new calculation.
* **About Group:** Displays the list of all 36 group members (split into two pages to fit on screen).

---

### How to Use

1. **Launch** the application. The Splash screen will appear and open the Main Calculator.
2. **Make:** Defaults to "Toyota".
3. **Engine Size:** Enter capacity (e.g., `1.8`, `2.5`).
4. **Year:** Enter manufacturing year (e.g., `2010`, `2020`).
5. **Duty:** Enter duty tax percentage (e.g., `10`).
6. **Facilities:** Check **AC** or **Sunroof** if applicable.
7. Click **Calculate** to see the total cost in Euros.
8. Click **Clear** to reset the form.
9. Click **About Group** to view the developers list.

---

### Key Source Code

#### 1. Calculation Logic (`cmdCalculate`)

```vb
Private Sub cmdCalculate_Click()
    Dim BasePrice As Currency, TotalCost As Currency, FacilitiesCost As Currency
    Dim EngineSize As Double, DutyPercent As Double
    Dim YearMade As Integer

    ' --- VALIDATION ---
    If Not IsNumeric(txtEngine.Text) Then MsgBox "Invalid Engine Size!", vbExclamation: Exit Sub
    If Not IsNumeric(txtYear.Text) Then MsgBox "Invalid Year!", vbExclamation: Exit Sub
    If Not IsNumeric(txtDuty.Text) Then MsgBox "Invalid Duty!", vbExclamation: Exit Sub

    ' --- LOGIC ---
    BasePrice = 5000000
    EngineSize = Val(txtEngine.Text)
    YearMade = Val(txtYear.Text)
    DutyPercent = Val(txtDuty.Text)

    If EngineSize > 2 Then BasePrice = BasePrice + 500000
    If YearMade > 0 And YearMade < 2015 Then BasePrice = BasePrice - 200000

    FacilitiesCost = 0
    If chkAC.Value = 1 Then FacilitiesCost = FacilitiesCost + 50000
    If chkRoof.Value = 1 Then FacilitiesCost = FacilitiesCost + 150000

    TotalCost = BasePrice + FacilitiesCost
    TotalCost = TotalCost + (TotalCost * (DutyPercent / 100))

    lblResult.Caption = "€ " & Format(TotalCost, "#,##0.00")
End Sub

```

#### 2. About Group Logic (`cmdAbout`)

*Note: This is split into two message boxes to ensure all names appear.*

```vb
Private Sub cmdAbout_Click()
    Dim ListPage1 As String
    Dim ListPage2 As String
    
    ' --- PAGE 1 (First 18 Names) ---
    ListPage1 = "CSC 207 - Group 3 (Page 1 of 2)" & vbCrLf & _
                "--------------------------------" & vbCrLf & _
                "240591081 – Eniola Uthman Oluwadarasimi" & vbCrLf & _
                "240591082 – EZE C.O" & vbCrLf & _
                "240591083 – Ezebube Chizitelum Odirachukwunma" & vbCrLf & _
                "240591084 – Ezeh Johncharles" & vbCrLf & _
                "240591085 – Olawale Anuoluwapo Ezekiel" & vbCrLf & _
                "240591087 – Fajemisin Alexander Olumuyiwa" & vbCrLf & _
                "240591088 – Fakoya Khalid" & vbCrLf & _
                "240591089 – Familusi Ayomikun" & vbCrLf & _
                "240591090 – Fasasi Mayowa" & vbCrLf & _
                "240591091 – Fasoyiro Samuel Oreoluwa" & vbCrLf & _
                "240591092 – Giwa Adesope Abdulmalik" & vbCrLf & _
                "240591093 – Giwa Aliameen Opeyemi" & vbCrLf & _
                "240591094 – Marvellous Godwin Osemudiamen" & vbCrLf & _
                "240591095 – Hammed Abdulrahman Adesina" & vbCrLf & _
                "240591096 – Hanidu Olawale Murtadha" & vbCrLf & _
                "240591097 – Hassan Mubarak Atanda" & vbCrLf & _
                "240591098 – Segun Ganiu Hassan" & vbCrLf & _
                "240591101 – Idowu Fawaz Olawunmi" & vbCrLf & vbCrLf & _
                ">>> Click OK for Next Page >>>"

    ' --- PAGE 2 (Remaining Names) ---
    ListPage2 = "CSC 207 - Group 3 (Page 2 of 2)" & vbCrLf & _
                "--------------------------------" & vbCrLf & _
                "240591102 – Idowu Matthew" & vbCrLf & _
                "240591103 – Ikechukwu Queen" & vbCrLf & _
                "240591104 – Inedu Esther Ogaicha" & vbCrLf & _
                "240591105 – Iniotuh Greatest" & vbCrLf & _
                "240591106 – Iwakun Oluwasegun Omotojumi" & vbCrLf & _
                "240591107 – Iwuno Vincent ChukwuEbuka" & vbCrLf & _
                "240591108 – Iyaniwura Olabamiji George" & vbCrLf & _
                "240591109 – Jawando Fuad Olamide" & vbCrLf & _
                "240591110 – Jeremiah David Preye" & vbCrLf & _
                "240591111 – Joseph Elizabeth Nifemi" & vbCrLf & _
                "240591112 – Kalejaiye Halimah Temilade" & vbCrLf & _
                "240591113 – Kasali Damilola Emmanuel" & vbCrLf & _
                "240591115 – Kehinde Oyindamola Ayomide" & vbCrLf & _
                "240591116 – Kolawole Abubakar Olaoluwa" & vbCrLf & _
                "240591117 – Kwegan Sean Oluwatomilade" & vbCrLf & _
                "240591118 – Lamina Rihanat Opemipo" & vbCrLf & _
                "240591119 – Lawal Sahal Adeshayo" & vbCrLf & _
                "240591120 – Ibrahim Oluwafemi Lawal"

    MsgBox ListPage1, vbInformation, "Group 3 List (1/2)"
    MsgBox ListPage2, vbInformation, "Group 3 List (2/2)"
End Sub

```

---

### Authors: CSC 207 - Group 3 (IDs 81-120)

* **240591081** – Eniola Uthman Oluwadarasimi
* **240591082** – EZE C.O
* **240591083** – Ezebube Chizitelum Odirachukwunma
* **240591084** – Ezeh Johncharles
* **240591085** – Olawale Anuoluwapo Ezekiel
* **240591087** – Fajemisin Alexander Olumuyiwa
* **240591088** – Fakoya Khalid
* **240591089** – Familusi Ayomikun
* **240591090** – Fasasi Mayowa
* **240591091** – Fasoyiro Samuel Oreoluwa
* **240591092** – Giwa Adesope Abdulmalik
* **240591093** – Giwa Aliameen Opeyemi
* **240591094** – Marvellous Godwin Osemudiamen
* **240591095** – Hammed Abdulrahman Adesina
* **240591096** – Hanidu Olawale Murtadha
* **240591097** – Hassan Mubarak Atanda
* **240591098** – Segun Ganiu Hassan
* **240591101** – Idowu Fawaz Olawunmi
* **240591102** – Idowu Matthew
* **240591103** – Ikechukwu Queen
* **240591104** – Inedu Esther Ogaicha
* **240591105** – Iniotuh Greatest
* **240591106** – Iwakun Oluwasegun Omotojumi
* **240591107** – Iwuno Vincent ChukwuEbuka
* **240591108** – Iyaniwura Olabamiji George
* **240591109** – Jawando Fuad Olamide
* **240591110** – Jeremiah David Preye
* **240591111** – Joseph Elizabeth Nifemi
* **240591112** – Kalejaiye Halimah Temilade
* **240591113** – Kasali Damilola Emmanuel
* **240591115** – Kehinde Oyindamola Ayomide
* **240591116** – Kolawole Abubakar Olaoluwa
* **240591117** – Kwegan Sean Oluwatomilade
* **240591118** – Lamina Rihanat Opemipo
* **240591119** – Lawal Sahal Adeshayo
* **240591120** – Ibrahim Oluwafemi Lawal