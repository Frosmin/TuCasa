package com.tucasa.backend.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class Functions {

    public static Date dateNow() throws ParseException {

        String DATE_FORMAT = "yyyy/MM/dd HH:mm:ss";

        Calendar cal = Calendar.getInstance();
        Date date = cal.getTime();

        TimeZone timeZone = TimeZone.getTimeZone("America/Caracas");
        SimpleDateFormat formatterWithTimeZone = new SimpleDateFormat(DATE_FORMAT);
        formatterWithTimeZone.setTimeZone(timeZone);

        // change tz using formatter
        String sDate = formatterWithTimeZone.format(date);

        // string to object date
        SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
        Date dateWithTimeZone = formatter.parse(sDate); // string to Date Object

        System.out.println( "############################ fecha y hora caracas #######");
        System.out.println( "############################:"  + dateWithTimeZone );
        System.out.println( "############################:"  + formatter.format(dateWithTimeZone) );

        return dateWithTimeZone;
    }

}
