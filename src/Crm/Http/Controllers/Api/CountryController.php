<?php

namespace Vsb\Crm\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return response()->json([
            ["id"=>"Afghanistan","title"=>"Afghanistan"],
            ["id"=>"Albania","title"=>"Albania"],
            ["id"=>"Algeria","title"=>"Algeria"],
            ["id"=>"Andorra","title"=>"Andorra"],
            ["id"=>"Angola","title"=>"Angola"],
            ["id"=>"Anguilla","title"=>"Anguilla"],
            ["id"=>"Antarctica","title"=>"Antarctica"],
            ["id"=>"Antigua and/or Barbuda","title"=>"Antigua and/or Barbuda"],
            ["id"=>"Argentina","title"=>"Argentina"],
            ["id"=>"Armenia","title"=>"Armenia"],
            ["id"=>"Aruba","title"=>"Aruba"],
            ["id"=>"Australia","title"=>"Australia"],
            ["id"=>"Austria","title"=>"Austria"],
            ["id"=>"Azerbaijan","title"=>"Azerbaijan"],
            ["id"=>"Bahamas","title"=>"Bahamas"],
            ["id"=>"Bahrain","title"=>"Bahrain"],
            ["id"=>"Bangladesh","title"=>"Bangladesh"],
            ["id"=>"Barbados","title"=>"Barbados"],
            ["id"=>"Belarus","title"=>"Belarus"],
            ["id"=>"Belgium","title"=>"Belgium"],
            ["id"=>"Belize","title"=>"Belize"],
            ["id"=>"Benin","title"=>"Benin"],
            ["id"=>"Bermuda","title"=>"Bermuda"],
            ["id"=>"Bhutan","title"=>"Bhutan"],
            ["id"=>"Bolivia","title"=>"Bolivia"],
            ["id"=>"Bosnia and Herzegovina","title"=>"Bosnia and Herzegovina"],
            ["id"=>"Botswana","title"=>"Botswana"],
            ["id"=>"Brazil","title"=>"Brazil"],
            ["id"=>"British lndian Ocean Territory","title"=>"British lndian Ocean Territory"],
            ["id"=>"Brunei Darussalam","title"=>"Brunei Darussalam"],
            ["id"=>"Bulgaria","title"=>"Bulgaria"],
            ["id"=>"Burkina Faso","title"=>"Burkina Faso"],
            ["id"=>"Burundi","title"=>"Burundi"],
            ["id"=>"Cambodia","title"=>"Cambodia"],
            ["id"=>"Cameroon","title"=>"Cameroon"],
            ["id"=>"Canada","title"=>"Canada"],
            ["id"=>"Cape Verde","title"=>"Cape Verde"],
            ["id"=>"Cayman Islands","title"=>"Cayman Islands"],
            ["id"=>"Central African Republic","title"=>"Central African Republic"],
            ["id"=>"Chad","title"=>"Chad"],
            ["id"=>"Chile","title"=>"Chile"],
            ["id"=>"China","title"=>"China"],
            ["id"=>"Christmas Island","title"=>"Christmas Island"],
            ["id"=>"Cocos (Keeling) Islands","title"=>"Cocos (Keeling) Islands"],
            ["id"=>"Colombia","title"=>"Colombia"],
            ["id"=>"Comoros","title"=>"Comoros"],
            ["id"=>"Congo","title"=>"Congo"],
            ["id"=>"Congo (la Rép. dém. du) (ex-Zaïre)","title"=>"Congo (la Rép. dém. du) (ex-Zaïre)"],
            ["id"=>"Cook Islands","title"=>"Cook Islands"],
            ["id"=>"Costa Rica","title"=>"Costa Rica"],
            ["id"=>"Croatia (Hrvatska)","title"=>"Croatia (Hrvatska)"],
            ["id"=>"Cuba","title"=>"Cuba"],
            ["id"=>"Cyprus","title"=>"Cyprus"],
            ["id"=>"Czech Republic","title"=>"Czech Republic"],
            ["id"=>"Denmark","title"=>"Denmark"],
            ["id"=>"Djibouti","title"=>"Djibouti"],
            ["id"=>"Dominica","title"=>"Dominica"],
            ["id"=>"Dominican Republic","title"=>"Dominican Republic"],
            ["id"=>"East Timor","title"=>"East Timor"],
            ["id"=>"Ecuador","title"=>"Ecuador"],
            ["id"=>"Egypt","title"=>"Egypt"],
            ["id"=>"El Salvador","title"=>"El Salvador"],
            ["id"=>"Equatorial Guinea","title"=>"Equatorial Guinea"],
            ["id"=>"Eritrea","title"=>"Eritrea"],
            ["id"=>"Estonia","title"=>"Estonia"],
            ["id"=>"Ethiopia","title"=>"Ethiopia"],
            ["id"=>"Falkland Islands (Malvinas)","title"=>"Falkland Islands (Malvinas)"],
            ["id"=>"Faroe Islands","title"=>"Faroe Islands"],
            ["id"=>"Fiji","title"=>"Fiji"],
            ["id"=>"Finland","title"=>"Finland"],
            ["id"=>"France","title"=>"France"],
            ["id"=>"French Guiana","title"=>"French Guiana"],
            ["id"=>"French Polynesia","title"=>"French Polynesia"],
            ["id"=>"Gabon","title"=>"Gabon"],
            ["id"=>"Gambia","title"=>"Gambia"],
            ["id"=>"Georgia","title"=>"Georgia"],
            ["id"=>"Germany","title"=>"Germany"],
            ["id"=>"Ghana","title"=>"Ghana"],
            ["id"=>"Gibraltar","title"=>"Gibraltar"],
            ["id"=>"Greece","title"=>"Greece"],
            ["id"=>"Greenland","title"=>"Greenland"],
            ["id"=>"Grenada","title"=>"Grenada"],
            ["id"=>"Guadeloupe","title"=>"Guadeloupe"],
            ["id"=>"Guam","title"=>"Guam"],
            ["id"=>"Guatemala","title"=>"Guatemala"],
            ["id"=>"Guinea","title"=>"Guinea"],
            ["id"=>"Guinea-Bissau","title"=>"Guinea-Bissau"],
            ["id"=>"Guyana","title"=>"Guyana"],
            ["id"=>"Haiti","title"=>"Haiti"],
            ["id"=>"Honduras","title"=>"Honduras"],
            ["id"=>"Hong Kong","title"=>"Hong Kong"],
            ["id"=>"Hungary","title"=>"Hungary"],
            ["id"=>"Iceland","title"=>"Iceland"],
            ["id"=>"India","title"=>"India"],
            ["id"=>"Indonesia","title"=>"Indonesia"],
            ["id"=>"Iran (Islamic Republic of)","title"=>"Iran (Islamic Republic of)"],
            ["id"=>"Iraq","title"=>"Iraq"],
            ["id"=>"Ireland","title"=>"Ireland"],
            ["id"=>"Israel","title"=>"Israel"],
            ["id"=>"Italy","title"=>"Italy"],
            ["id"=>"Ivory Coast","title"=>"Ivory Coast"],
            ["id"=>"Jamaica","title"=>"Jamaica"],
            ["id"=>"Japan","title"=>"Japan"],
            ["id"=>"Jordan","title"=>"Jordan"],
            ["id"=>"Kazakhstan","title"=>"Kazakhstan"],
            ["id"=>"Kenya","title"=>"Kenya"],
            ["id"=>"Kiribati","title"=>"Kiribati"],
            ["id"=>"Korea","title"=>"Korea"],
            ["id"=>"Democratic People\'s Republic of","title"=>"Democratic People\'s Republic of"],
            ["id"=>" Republic of","title"=>" Republic of"],
            ["id"=>"Kuwait","title"=>"Kuwait"],
            ["id"=>"Kyrgyzstan","title"=>"Kyrgyzstan"],
            ["id"=>"Lao People\'s Democratic Republic","title"=>"Lao People\'s Democratic Republic"],
            ["id"=>"Latvia","title"=>"Latvia"],
            ["id"=>"Lebanon","title"=>"Lebanon"],
            ["id"=>"les Samoa américaines","title"=>"les Samoa américaines"],
            ["id"=>"Lesotho","title"=>"Lesotho"],
            ["id"=>"Liberia","title"=>"Liberia"],
            ["id"=>"Libyan Arab Jamahiriya","title"=>"Libyan Arab Jamahiriya"],
            ["id"=>"Liechtenstein","title"=>"Liechtenstein"],
            ["id"=>"Lithuania","title"=>"Lithuania"],
            ["id"=>"Luxembourg","title"=>"Luxembourg"],
            ["id"=>"Macau","title"=>"Macau"],
            ["id"=>"Macedonia","title"=>"Macedonia"],
            ["id"=>"Madagascar","title"=>"Madagascar"],
            ["id"=>"Malawi","title"=>"Malawi"],
            ["id"=>"Malaysia","title"=>"Malaysia"],
            ["id"=>"Maldives","title"=>"Maldives"],
            ["id"=>"Mali","title"=>"Mali"],
            ["id"=>"Malta","title"=>"Malta"],
            ["id"=>"Marshall Islands","title"=>"Marshall Islands"],
            ["id"=>"Martinique","title"=>"Martinique"],
            ["id"=>"Mauritania","title"=>"Mauritania"],
            ["id"=>"Mauritius","title"=>"Mauritius"],
            ["id"=>"Mayotte","title"=>"Mayotte"],
            ["id"=>"Mexico","title"=>"Mexico"],
            ["id"=>"Micronesia","title"=>"Micronesia"],
            ["id"=>" Federated States of","title"=>" Federated States of"],
            ["id"=>"Moldova","title"=>"Moldova"],
            ["id"=>" Republic of","title"=>" Republic of"],
            ["id"=>"Monaco","title"=>"Monaco"],
            ["id"=>"Mongolia","title"=>"Mongolia"],
            ["id"=>"Montserrat","title"=>"Montserrat"],
            ["id"=>"Morocco","title"=>"Morocco"],
            ["id"=>"Mozambique","title"=>"Mozambique"],
            ["id"=>"Myanmar","title"=>"Myanmar"],
            ["id"=>"Namibia","title"=>"Namibia"],
            ["id"=>"Nauru","title"=>"Nauru"],
            ["id"=>"Nepal","title"=>"Nepal"],
            ["id"=>"Netherlands","title"=>"Netherlands"],
            ["id"=>"Netherlands Antilles","title"=>"Netherlands Antilles"],
            ["id"=>"New Caledonia","title"=>"New Caledonia"],
            ["id"=>"New Caledonia","title"=>"New Caledonia"],
            ["id"=>"New Zealand","title"=>"New Zealand"],
            ["id"=>"Nicaragua","title"=>"Nicaragua"],
            ["id"=>"Niger","title"=>"Niger"],
            ["id"=>"Nigeria","title"=>"Nigeria"],
            ["id"=>"Niue","title"=>"Niue"],
            ["id"=>"Norfork Island","title"=>"Norfork Island"],
            ["id"=>"Northern Mariana Islands","title"=>"Northern Mariana Islands"],
            ["id"=>"Norway","title"=>"Norway"],
            ["id"=>"Oman","title"=>"Oman"],
            ["id"=>"Pakistan","title"=>"Pakistan"],
            ["id"=>"Palau","title"=>"Palau"],
            ["id"=>"Panama","title"=>"Panama"],
            ["id"=>"Papua New Guinea","title"=>"Papua New Guinea"],
            ["id"=>"Paraguay","title"=>"Paraguay"],
            ["id"=>"Peru","title"=>"Peru"],
            ["id"=>"Philippines","title"=>"Philippines"],
            ["id"=>"Pitcairn","title"=>"Pitcairn"],
            ["id"=>"Poland","title"=>"Poland"],
            ["id"=>"Portugal","title"=>"Portugal"],
            ["id"=>"Qatar","title"=>"Qatar"],
            ["id"=>"Reunion","title"=>"Reunion"],
            ["id"=>"Romania","title"=>"Romania"],
            ["id"=>"Russian Federation","title"=>"Russian Federation"],
            ["id"=>"Rwanda","title"=>"Rwanda"],
            ["id"=>"Saint Kitts and Nevis","title"=>"Saint Kitts and Nevis"],
            ["id"=>"Saint Lucia","title"=>"Saint Lucia"],
            ["id"=>"Saint Vincent and the Grenadines","title"=>"Saint Vincent and the Grenadines"],
            ["id"=>"Samoa","title"=>"Samoa"],
            ["id"=>"Samoa américaine","title"=>"Samoa américaine"],
            ["id"=>"San Marino","title"=>"San Marino"],
            ["id"=>"Sao Tome and Principe","title"=>"Sao Tome and Principe"],
            ["id"=>"Saudi Arabia","title"=>"Saudi Arabia"],
            ["id"=>"Senegal","title"=>"Senegal"],
            ["id"=>"Seychelles","title"=>"Seychelles"],
            ["id"=>"Sierra Leone","title"=>"Sierra Leone"],
            ["id"=>"Singapore","title"=>"Singapore"],
            ["id"=>"Slovakia","title"=>"Slovakia"],
            ["id"=>"Slovenia","title"=>"Slovenia"],
            ["id"=>"Solomon Islands","title"=>"Solomon Islands"],
            ["id"=>"Somalia","title"=>"Somalia"],
            ["id"=>"South Africa","title"=>"South Africa"],
            ["id"=>"Spain","title"=>"Spain"],
            ["id"=>"Sri Lanka","title"=>"Sri Lanka"],
            ["id"=>"St. Helena","title"=>"St. Helena"],
            ["id"=>"St. Pierre and Miquelon","title"=>"St. Pierre and Miquelon"],
            ["id"=>"Sudan","title"=>"Sudan"],
            ["id"=>"Suriname","title"=>"Suriname"],
            ["id"=>"Svalbarn and Jan Mayen Islands","title"=>"Svalbarn and Jan Mayen Islands"],
            ["id"=>"Swaziland","title"=>"Swaziland"],
            ["id"=>"Sweden","title"=>"Sweden"],
            ["id"=>"Switzerland","title"=>"Switzerland"],
            ["id"=>"Syrian Arab Republic","title"=>"Syrian Arab Republic"],
            ["id"=>"Taiwan","title"=>"Taiwan"],
            ["id"=>"Tajikistan","title"=>"Tajikistan"],
            ["id"=>"Tanzania","title"=>"Tanzania"],
            ["id"=>" United Republic of","title"=>" United Republic of"],
            ["id"=>"Thailand","title"=>"Thailand"],
            ["id"=>"Togo","title"=>"Togo"],
            ["id"=>"Tokelau","title"=>"Tokelau"],
            ["id"=>"Tonga","title"=>"Tonga"],
            ["id"=>"Trinidad and Tobago","title"=>"Trinidad and Tobago"],
            ["id"=>"Tunisia","title"=>"Tunisia"],
            ["id"=>"Turkey","title"=>"Turkey"],
            ["id"=>"Turkmenistan","title"=>"Turkmenistan"],
            ["id"=>"Turks and Caicos Islands","title"=>"Turks and Caicos Islands"],
            ["id"=>"Tuvalu","title"=>"Tuvalu"],
            ["id"=>"Uganda","title"=>"Uganda"],
            ["id"=>"Ukraine","title"=>"Ukraine"],
            ["id"=>"United Arab Emirates","title"=>"United Arab Emirates"],
            ["id"=>"United Kingdom","title"=>"United Kingdom"],
            ["id"=>"United States","title"=>"United States"],
            ["id"=>"URSS","title"=>"URSS"],
            ["id"=>"Uruguay","title"=>"Uruguay"],
            ["id"=>"Uzbekistan","title"=>"Uzbekistan"],
            ["id"=>"Vanuatu","title"=>"Vanuatu"],
            ["id"=>"Vatican City State","title"=>"Vatican City State"],
            ["id"=>"Venezuela","title"=>"Venezuela"],
            ["id"=>"Vietnam","title"=>"Vietnam"],
            ["id"=>"Virgin Islands (British)","title"=>"Virgin Islands (British)"],
            ["id"=>"Virgin Islands (U.S.)","title"=>"Virgin Islands (U.S.)"],
            ["id"=>"Wallis and Futuna Islands","title"=>"Wallis and Futuna Islands"],
            ["id"=>"Western Sahara","title"=>"Western Sahara"],
            ["id"=>"Yemen","title"=>"Yemen"],
            ["id"=>"Yugoslavia","title"=>"Yugoslavia"],
            ["id"=>"Zaire","title"=>"Zaire"],
            ["id"=>"Zambia","title"=>"Zambia"],
            ["id"=>"Zimbabwe","title"=>"Zimbabwe"],
            ["id"=>"Zone neutre","title"=>"Zone neutre"],
        ],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
