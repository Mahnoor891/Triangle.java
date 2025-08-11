import java.util.InputMismatchException;
import java .util.Scanner;

public class Rationalnumber {
    private int numerator;
    private int denominator;
    Scanner sc = new Scanner(System.in);

    // constructor
    public Rationalnumber() {
        try {
        System.out.println("Enter Numerator: ");
        numerator = sc.nextInt();
        this.setNumerator(numerator);
        System.out.println("Enter Denominator: ");
        denominator = sc.nextInt();
        this.setDenominator(denominator);
        }
        catch (InputMismatchException e) {
            System.out.println("Wrong Input: Input shouldn't be irrational number.");
        }

        }
      // Constructor Closed
    // Now for get and set function..
    public int getNumerator() {
        return numerator;

    }
    public void setNumerator(int n1) {
        this.numerator = n1;
    }
    public int getdenominator() {
        return denominator;
    }
    public void setDenominator(int n2) {
        this.denominator = n2;
    }

// Now for Addition...
public Rationalnumber add(Rationalnumber r ) {
    /* As we are about to add two rational numbers
     * for example 3/4 + 5/9..There is a need to perform
     * LCM to add these numbers correctly. So, We will
     * find LCM of denominators for adding rational numbers
    */
    int CommonDen =LCM(this.denominator, r.denominator) ;
    // Here CommonDen = common denominator
    // CommonDen = 3,6 = 6
    int num1 = (this.numerator *(CommonDen/ this.denominator));
    int num2 = (r.numerator *(CommonDen/r.denominator));
    Rationalnumber Rnum = new Rationalnumber();
    Rnum.setNumerator(num1 + num2);
    Rnum.setDenominator(CommonDen);
    // Rnum to store the resulted values 
    return Rnum;

}

//Now for Subtraction.....
public Rationalnumber subtract(Rationalnumber r) {
    // Same procedure goes here...
    int CommonDen =LCM(this.denominator, r.denominator);
    // int CommonDen = 3,6 = 6
    int num1 = (this.numerator *(CommonDen/this.denominator));
    int num2 = (r.numerator * (CommonDen/r.denominator));
    Rationalnumber Rnum = new Rationalnumber();
    Rnum.setNumerator(num1 - num2);
    Rnum.setDenominator(CommonDen);
    return Rnum;
}

//Finding LCM ...but find GCD first
// Now for GCD ...Using public static to avoid creating object
// GCD is just a private helper to find LCM
private static int GCD(int a, int b) {
    while(b!= 0) {
        int temp = b;
        b = a % b ;
        a = temp;
    }
    return a;
}
// Now for LCM 
public int LCM(int a, int b) {
    return ( a * b) / GCD (a , b);
}
public void display() {
    System.out.println(numerator + "/" + denominator );
}
}




        



    

    

